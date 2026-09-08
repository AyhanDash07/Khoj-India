import { supabaseAdmin } from '../config/supabase.js'

export async function getDestinationById(id: number) {
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
      states (
        id,
        name,
        code
      ),
      pressure_data (
        pressure_score,
        pressure_level,
        visitor_trend,
        peak_periods,
        data_source,
        measured_at
      ),
      impact_data (
        impact_score,
        local_ownership_score,
        community_participation_score,
        local_sourcing_score,
        heritage_preservation_score,
        environmental_practice_score,
        data_source,
        measured_at
      ),
      safety_data (
        safety_level,
        solo_travel_suitability,
        night_travel_advisory,
        emergency_information,
        data_source,
        updated_at
      ),
      accessibility_data (
        wheelchair_accessible,
        accessible_transport,
        accessible_accommodation,
        accessible_restrooms,
        accessibility_notes,
        data_source,
        updated_at
      )
    `)
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error) {
    throw new Error(`Failed to fetch destination: ${error.message}`)
  }

  return data
}