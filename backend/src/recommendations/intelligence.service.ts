import { supabaseAdmin } from '../config/supabase.js'
import type {
  DestinationExperience,
  DestinationIntelligence,
  DestinationProfile,
  TravellerPreferences,
} from './intelligence.types.js'

/**
 * Fetch the authenticated traveller's preferences.
 *
 * The backend uses the Supabase service-role client because
 * authentication has already been handled by auth.middleware.ts.
 */
export async function getTravellerPreferences(
  userId: string,
): Promise<TravellerPreferences> {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .select(`
      interests,
      travel_styles,
      preferred_trip_duration_days,
      budget_per_day,
      budget_currency,
      crowd_preference,
      preferred_regions,
      accessibility_needs,
      food_preferences,
      language_preferences
    `)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to fetch traveller preferences: ${error.message}`,
    )
  }
  console.log(
  '[KHOJ DEBUG] Traveller preferences:',
  JSON.stringify(data, null, 2),
)

  return {
    interests: data?.interests ?? [],
    travel_styles: data?.travel_styles ?? [],
    preferred_trip_duration_days:
      data?.preferred_trip_duration_days ?? null,
    budget_per_day: data?.budget_per_day ?? null,
    budget_currency: data?.budget_currency ?? 'INR',
    crowd_preference: data?.crowd_preference ?? null,
    preferred_regions: data?.preferred_regions ?? [],
    accessibility_needs: data?.accessibility_needs ?? [],
    food_preferences: data?.food_preferences ?? [],
    language_preferences: data?.language_preferences ?? [],
  }
}

/**
 * Fetch the core destination information required by
 * Khoj Intelligence.
 */
export async function getDestinationForIntelligence(
  destinationId: number,
): Promise<DestinationProfile> {
  const { data, error } = await supabaseAdmin
    .from('destinations')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      destination_type,
      latitude,
      longitude,
      featured,
      verified,
      state_id,
      states (
        name
      ),
      destination_tag_map (
        destination_tags (
          name,
          tag_type
        )
      )
    `)
    .eq('id', destinationId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to fetch destination: ${error.message}`,
    )
  }

  if (!data) {
    throw new Error('Destination not found.')
  }

  const tags = {
    interests: [] as string[],
    travel_styles: [] as string[],
    regions: [] as string[],
    food: [] as string[],
  }

  for (const mapping of data.destination_tag_map ?? []) {
    const tag = Array.isArray(mapping.destination_tags)
      ? mapping.destination_tags[0]
      : mapping.destination_tags

    if (!tag) continue

    if (tag.tag_type === 'interest') {
      tags.interests.push(tag.name)
    }

    if (tag.tag_type === 'travel_style') {
      tags.travel_styles.push(tag.name)
    }

    if (tag.tag_type === 'region') {
      tags.regions.push(tag.name)
    }

    if (tag.tag_type === 'food') {
      tags.food.push(tag.name)
    }
  }

  const state = Array.isArray(data.states)
  ? data.states[0]
  : data.states
  return {
  id: data.id,
  name: data.name,
  slug: data.slug,
  short_description: data.short_description,
  description: data.description,
  destination_type: data.destination_type,
  latitude: data.latitude,
  longitude: data.longitude,
  featured: data.featured,
  verified: data.verified,
  state_name: state?.name ?? null,
  tags,
}
}

/**
 * Fetch the latest available intelligence data for a destination.
 *
 * Each intelligence dimension comes from its own table.
 *
 * Missing data is represented using a neutral object rather
 * than null so that the scoring engine always receives a
 * predictable structure.
 */
export async function getDestinationIntelligence(
  destinationId: number,
): Promise<DestinationIntelligence> {
  const [
    pressureResult,
    impactResult,
    safetyResult,
    accessibilityResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('pressure_data')
      .select(`
        pressure_score,
        pressure_level,
        visitor_trend
      `)
      .eq('destination_id', destinationId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabaseAdmin
      .from('impact_data')
      .select(`
        impact_score,
        local_ownership_score,
        community_participation_score,
        local_sourcing_score,
        heritage_preservation_score,
        environmental_practice_score
      `)
      .eq('destination_id', destinationId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabaseAdmin
      .from('safety_data')
      .select(`
        safety_level,
        solo_travel_suitability,
        night_travel_advisory,
        emergency_information
      `)
      .eq('destination_id', destinationId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabaseAdmin
      .from('accessibility_data')
      .select(`
        wheelchair_accessible,
        accessible_transport,
        accessible_accommodation,
        accessible_restrooms,
        accessibility_notes
      `)
      .eq('destination_id', destinationId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (pressureResult.error) {
    throw new Error(
      `Failed to fetch destination pressure data: ${pressureResult.error.message}`,
    )
  }

  if (impactResult.error) {
    throw new Error(
      `Failed to fetch destination impact data: ${impactResult.error.message}`,
    )
  }

  if (safetyResult.error) {
    throw new Error(
      `Failed to fetch destination safety data: ${safetyResult.error.message}`,
    )
  }

  if (accessibilityResult.error) {
    throw new Error(
      `Failed to fetch destination accessibility data: ${accessibilityResult.error.message}`,
    )
  }

  const pressure = pressureResult.data
  const impact = impactResult.data
  const safety = safetyResult.data
  const accessibility = accessibilityResult.data

  return {
    pressure: {
      score: pressure?.pressure_score ?? null,
      level: pressure?.pressure_level ?? null,
      visitor_trend: pressure?.visitor_trend ?? null,
    },

    impact: {
      score: impact?.impact_score ?? null,
      local_ownership_score:
        impact?.local_ownership_score ?? null,
      community_participation_score:
        impact?.community_participation_score ?? null,
      local_sourcing_score:
        impact?.local_sourcing_score ?? null,
      heritage_preservation_score:
        impact?.heritage_preservation_score ?? null,
      environmental_practice_score:
        impact?.environmental_practice_score ?? null,
    },

    safety: {
      level: safety?.safety_level ?? null,
      solo_travel_suitability:
        safety?.solo_travel_suitability ?? null,
      night_travel_advisory:
        safety?.night_travel_advisory ?? null,
      emergency_information:
        safety?.emergency_information ?? null,
    },

    accessibility: {
      wheelchair_accessible:
        accessibility?.wheelchair_accessible ?? null,
      accessible_transport:
        accessibility?.accessible_transport ?? null,
      accessible_accommodation:
        accessibility?.accessible_accommodation ?? null,
      accessible_restrooms:
        accessibility?.accessible_restrooms ?? null,
      accessibility_notes:
        accessibility?.accessibility_notes ?? null,
    },
  }
}

/**
 * Fetch active experiences associated with a destination.
 *
 * Database schema:
 *
 * experiences.title          -> mapped to interface `name`
 * experiences.price_from     -> mapped to interface `price`
 * experiences.duration_minutes -> converted to hours
 *
 * The interface deliberately hides database-specific naming
 * from the scoring engine.
 */
export async function getDestinationExperiences(
  destinationId: number,
): Promise<DestinationExperience[]> {
  const { data, error } = await supabaseAdmin
    .from('experience_partners')
    .select(`
      experiences (
        id,
        destination_id,
        category_id,
        title,
        description,
        duration_minutes,
        price_from,
        impact_score,
        verified,
        active,
        categories (
          id,
          name
        )
      )
    `)

  if (error) {
    throw new Error(
      `Failed to fetch destination experiences: ${error.message}`,
    )
  }

  if (!data) {
    return []
  }

  const experiences: DestinationExperience[] = []

  for (const row of data) {
    const experienceData = row.experiences

    if (!experienceData) {
      continue
    }

    /**
     * Supabase relationship results can be returned as either
     * an object or an array depending on the relationship.
     */
    const experience = Array.isArray(experienceData)
      ? experienceData[0]
      : experienceData

    if (!experience) {
      continue
    }

    /**
     * Only keep experiences belonging to the requested
     * destination.
     */
    if (experience.destination_id !== destinationId) {
      continue
    }

    /**
     * Inactive experiences must never enter the
     * recommendation engine.
     */
    if (experience.active === false) {
      continue
    }

    const categoryData = experience.categories

    const category = Array.isArray(categoryData)
      ? categoryData[0]
      : categoryData

    experiences.push({
      id: experience.id,

      // Database `title` -> intelligence interface `name`
      name: experience.title,

      description: experience.description ?? null,

      // Database category object -> interface category string
      category: category?.name ?? null,

      // Database `price_from` -> interface `price`
      price: experience.price_from ?? null,

      // Convert minutes -> hours
      duration_hours:
        experience.duration_minutes !== null &&
        experience.duration_minutes !== undefined
          ? experience.duration_minutes / 60
          : null,

      verified: experience.verified ?? false,
    })
  }

  return experiences
}