import { supabaseAdmin } from '../config/supabase.js'

export async function getDestinations() {
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
      verified
    `)
    .eq('active', true)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch destinations: ${error.message}`)
  }

  return data
}