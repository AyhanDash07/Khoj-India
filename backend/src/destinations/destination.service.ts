import { supabaseAdmin } from '../config/supabase.js'

export async function getDestinations() {
  const { data: destinations, error } =
    await supabaseAdmin
      .from('destinations')
      .select(`
        id,
        state_id,
        name,
        slug,
        short_description,
        description,
        destination_type,
        latitude,
        longitude,
        featured,
        verified
      `)
      .eq('active', true)
      .order('name', { ascending: true })

  if (error) {
    throw new Error(
      `Failed to fetch destinations: ${error.message}`,
    )
  }

  if (!destinations || destinations.length === 0) {
    return []
  }

  const destinationIds =
    destinations.map(
      (destination) => destination.id,
    )

  const { data: heroMedia, error: mediaError } =
    await supabaseAdmin
      .from('media')
      .select(`
        id,
        destination_id,
        media_url,
        thumbnail_url,
        alt_text,
        caption,
        media_role,
        is_featured,
        source_url,
        source_author,
        source_license,
        source_license_url
      `)
      .in('destination_id', destinationIds)
      .eq('media_role', 'hero')
      .eq('media_type', 'image')
      .order('display_order', {
        ascending: true,
      })

  if (mediaError) {
    throw new Error(
      `Failed to fetch destination media: ${mediaError.message}`,
    )
  }

  const heroMediaByDestination = new Map<
    number,
    (typeof heroMedia)[number]
  >()

  for (const media of heroMedia ?? []) {
    if (
      !heroMediaByDestination.has(
        media.destination_id,
      )
    ) {
      heroMediaByDestination.set(
        media.destination_id,
        media,
      )
    }
  }

  return destinations.map((destination) => ({
    ...destination,
    hero_media:
      heroMediaByDestination.get(
        destination.id,
      ) ?? null,
  }))
}

export async function getDestinationById(
  destinationId: number,
) {
  // ---------------------------------------------------------
  // 1. Fetch the core destination + state information
  // ---------------------------------------------------------

  const {
    data: destination,
    error: destinationError,
  } = await supabaseAdmin
    .from('destinations')
    .select(`
      id,
      state_id,
      name,
      slug,
      short_description,
      description,
      destination_type,
      latitude,
      longitude,
      featured,
      verified,
      states (
        id,
        name,
        code
      )
    `)
    .eq('id', destinationId)
    .eq('active', true)
    .maybeSingle()

  if (destinationError) {
    throw new Error(
      `Failed to fetch destination: ${destinationError.message}`,
    )
  }

  if (!destination) {
    return null
  }

  // ---------------------------------------------------------
  // 2. Fetch the destination hero image
  // ---------------------------------------------------------

  const {
    data: heroMedia,
    error: heroMediaError,
  } = await supabaseAdmin
    .from('media')
    .select(`
      id,
      media_type,
      media_url,
      thumbnail_url,
      alt_text,
      caption,
      media_role,
      is_featured,
      source_url,
      source_author,
      source_license,
      source_license_url
    `)
    .eq('destination_id', destinationId)
    .eq('media_role', 'hero')
    .eq('media_type', 'image')
    .order('display_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (heroMediaError) {
    throw new Error(
      `Failed to fetch destination media: ${heroMediaError.message}`,
    )
  }

  // ---------------------------------------------------------
  // 3. Fetch destination story
  // ---------------------------------------------------------

  const {
    data: destinationStory,
    error: destinationStoryError,
  } = await supabaseAdmin
    .from('destination_stories')
    .select(`
      id,
      destination_id,
      origin_story,
      cultural_significance,
      ecological_story,
      what_makes_it_special,
      things_to_know,
      responsible_travel_notes,
      data_source,
      measured_at
    `)
    .eq('destination_id', destinationId)
    .maybeSingle()

  if (destinationStoryError) {
    throw new Error(
      `Failed to fetch destination story: ${destinationStoryError.message}`,
    )
  }

  // ---------------------------------------------------------
  // 4. Fetch all intelligence dimensions + experiences
  // ---------------------------------------------------------

  const [
    impactResult,
    safetyResult,
    pressureResult,
    accessibilityResult,
    seasonalityResult,
    experiencesResult,
  ] = await Promise.all([
    // -------------------------------------------------------
    // Impact
    // -------------------------------------------------------

    supabaseAdmin
      .from('impact_data')
      .select(`
        impact_score,
        local_ownership_score,
        community_participation_score,
        local_sourcing_score,
        heritage_preservation_score,
        environmental_practice_score,
        data_source,
        measured_at
      `)
      .eq('destination_id', destinationId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    // -------------------------------------------------------
    // Safety
    // -------------------------------------------------------

    supabaseAdmin
      .from('safety_data')
      .select(`
        safety_level,
        solo_travel_suitability,
        night_travel_advisory,
        emergency_information,
        data_source,
        updated_at
      `)
      .eq('destination_id', destinationId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    // -------------------------------------------------------
    // Tourism pressure
    // -------------------------------------------------------

    supabaseAdmin
      .from('pressure_data')
      .select(`
        pressure_score,
        pressure_level,
        visitor_trend,
        peak_periods,
        data_source,
        measured_at
      `)
      .eq('destination_id', destinationId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    // -------------------------------------------------------
    // Accessibility
    // -------------------------------------------------------

    supabaseAdmin
      .from('accessibility_data')
      .select(`
        wheelchair_accessible,
        accessible_transport,
        accessible_accommodation,
        accessible_restrooms,
        accessibility_notes,
        data_source,
        updated_at
      `)
      .eq('destination_id', destinationId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    // -------------------------------------------------------
    // Seasonality
    // -------------------------------------------------------

    supabaseAdmin
      .from('destination_seasonality')
      .select(`
        month,
        suitability_score,
        season_label,
        weather_notes,
        accessibility_notes,
        crowd_notes,
        data_source,
        measured_at
      `)
      .eq('destination_id', destinationId)
      .order('month', { ascending: true }),

    // -------------------------------------------------------
    // Experiences
    // -------------------------------------------------------

    supabaseAdmin
      .from('experiences')
      .select(`
        id,
        title,
        slug,
        short_description,
        description,
        category_id,
        duration_minutes,
        price_from,
        max_group_size,
        impact_score,
        verified,
        active
      `)
      .eq('destination_id', destinationId)
      .eq('active', true)
      .order('title', { ascending: true }),
  ])

  // ---------------------------------------------------------
  // 5. Detect any intelligence query failures
  // ---------------------------------------------------------

  const results = [
    impactResult,
    safetyResult,
    pressureResult,
    accessibilityResult,
    seasonalityResult,
    experiencesResult,
  ]

  const failedResult = results.find(
    (result) => result.error,
  )

  if (failedResult?.error) {
    throw new Error(
      `Failed to fetch destination intelligence: ${failedResult.error.message}`,
    )
  }

  // ---------------------------------------------------------
  // 6. Return the complete destination detail payload
  // ---------------------------------------------------------

  return {
    destination,
    hero_media: heroMedia ?? null,
    story: destinationStory ?? null,
    intelligence: {
      impact: impactResult.data ?? null,
      safety: safetyResult.data ?? null,
      pressure: pressureResult.data ?? null,
      accessibility: accessibilityResult.data ?? null,
      seasonality: seasonalityResult.data ?? [],
    },
    experiences: experiencesResult.data ?? [],
  }
}