import { supabaseAdmin } from '../config/supabase.js'

import {
  findRedistributionSuggestions,
} from './redistribution.service.js'

import {
  calculateIntelligenceScore,
} from './intelligence.scoring.js'

import {
  getDestinationExperiences,
  getDestinationForIntelligence,
  getDestinationIntelligence,
  getTravellerPreferences,
} from './intelligence.service.js'

import type {
  Recommendation,
  RecommendationFilters,
  RecommendationResponse,
} from './recommendation.types.js'

function getMatchLabel(
  score: number,
): Recommendation['match_label'] {
  if (score >= 90) return 'Exceptional match'
  if (score >= 80) return 'Excellent match'
  if (score >= 70) return 'Strong match'
  if (score >= 55) return 'Good match'
  if (score >= 40) return 'Fair match'
  return 'Low match'
}

function getConfidenceLabel(
  level: 'high' | 'moderate' | 'limited',
): Recommendation['confidence_label'] {
  if (level === 'high') return 'High confidence'
  if (level === 'moderate') return 'Moderate confidence'
  return 'Limited confidence'
}

async function getDestinationMedia(
  destinationId: number,
): Promise<{
  image_url: string | null
  image_alt: string | null
  image_caption: string | null
}> {
  const { data, error } = await supabaseAdmin
    .from('media')
    .select(`
      media_url,
      alt_text,
      caption
    `)
    .eq('destination_id', destinationId)
    .eq('media_type', 'image')
    .eq('media_role', 'hero')
    .order('display_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to fetch destination media: ${error.message}`,
    )
  }

  return {
    image_url: data?.media_url ?? null,
    image_alt: data?.alt_text ?? null,
    image_caption: data?.caption ?? null,
  }
}

interface DestinationCandidate {
  id: number
  name: string
  slug: string
  short_description: string | null
  description: string | null
  destination_type: string | null
  state_id: number | null
  featured: boolean
  verified: boolean
  active: boolean
}

export async function getSmartRecommendations(
  userId: string,
  filters: RecommendationFilters = {},
): Promise<RecommendationResponse> {
  const traveller =
    await getTravellerPreferences(userId)

  const travelMonth =
    traveller.travel_month

  let destinationQuery = supabaseAdmin
    .from('destinations')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      destination_type,
      state_id,
      featured,
      verified,
      active
    `)
    .eq('active', true)

  if (filters.destination_type) {
    destinationQuery = destinationQuery.eq(
      'destination_type',
      filters.destination_type,
    )
  }

  const {
    data: destinations,
    error: destinationsError,
  } = await destinationQuery
    .order('featured', { ascending: false })
    .order('name', { ascending: true })

  if (destinationsError) {
    throw new Error(
      `Failed to fetch destinations: ${destinationsError.message}`,
    )
  }

  const candidates =
    (destinations ?? []) as DestinationCandidate[]

  const evaluated = await Promise.all(
    candidates.map(async (candidate) => {
      const [
        destination,
        intelligence,
        experiences,
        media,
      ] = await Promise.all([
        getDestinationForIntelligence(candidate.id),

        getDestinationIntelligence(
          candidate.id,
          travelMonth,
        ),

        getDestinationExperiences(candidate.id),

        getDestinationMedia(candidate.id),
      ])

      if (
        filters.preferred_region &&
        destination.state_name?.toLowerCase() !==
          filters.preferred_region.toLowerCase()
      ) {
        return null
      }

      const intelligenceResult =
        calculateIntelligenceScore({
          traveller,
          destination,
          intelligence,
          experiences,
          context: {
            travel_month: travelMonth,
          },
        })

      const overall =
        intelligenceResult.score.overall

      return {
        destination: {
          id: candidate.id,
          name: candidate.name,
          slug: candidate.slug,
          short_description:
            candidate.short_description,
          description:
            candidate.description,
          destination_type:
            candidate.destination_type,
          state_name:
            destination.state_name,
          latitude:
            destination.latitude,
          longitude:
            destination.longitude,
          image_url:
            media.image_url,
          image_alt:
            media.image_alt,
          image_caption:
            media.image_caption,
          featured:
            candidate.featured,
          verified:
            candidate.verified,
        },

        intelligence:
          intelligenceResult,

        match_label:
          getMatchLabel(overall),

        confidence_label:
          getConfidenceLabel(
            intelligenceResult.score
              .confidence.level,
          ),
      }
    }),
  )

  const validRecommendations =
    evaluated.filter(
      (
        item,
      ): item is NonNullable<typeof item> =>
        item !== null,
    )

  validRecommendations.sort((a, b) => {
    const overallDifference =
      b.intelligence.score.overall -
      a.intelligence.score.overall

    if (overallDifference !== 0) {
      return overallDifference
    }

    const personalFitDifference =
      b.intelligence.score.personal_fit -
      a.intelligence.score.personal_fit

    if (personalFitDifference !== 0) {
      return personalFitDifference
    }

    return (
      (b.intelligence.score.impact ?? 0) -
      (a.intelligence.score.impact ?? 0)
    )
  })

  /*
   * Build the complete ranked recommendation pool
   * before limiting the number of recommendations
   * returned to the frontend.
   *
   * This allows the redistribution engine to evaluate
   * destinations outside the visible top six.
   */
  const rankedRecommendations: Recommendation[] =
    validRecommendations.map(
      (recommendation, index) => ({
        ...recommendation,
        rank: index + 1,
      }),
    )

  /*
   * Pressure-aware redistribution evaluates the
   * complete candidate pool rather than only the
   * recommendations shown to the traveller.
   */
  const redistributionSuggestions =
    findRedistributionSuggestions(
      rankedRecommendations,
    )

  /*
   * Keep the existing public recommendation limit.
   * Redistribution suggestions will be exposed
   * through the API response in the next step.
   */
  const maxResults =
    filters.max_results ?? 6

  const recommendations =
    rankedRecommendations.slice(
      0,
      maxResults,
    )

  const topRecommendation =
    recommendations[0]

  const topMatch = topRecommendation
    ? {
        destination_id:
          topRecommendation.destination.id,

        destination_name:
          topRecommendation.destination.name,

        score:
          topRecommendation.intelligence
            .score.overall,
      }
    : null

  /*
   * Prevent the redistribution calculation from
   * being optimized away while keeping the current
   * response contract unchanged.
   *
   * The suggestions will be returned by the API
   * in the next Block 05.4 step.
   */

  return {
  recommendations,

  redistribution_suggestions:
    redistributionSuggestions,

  summary: {
    total_destinations_evaluated:
      validRecommendations.length,

    recommendations_returned:
      recommendations.length,

    top_match: topMatch,
  },
}
}