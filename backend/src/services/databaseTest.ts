import { supabaseAdmin } from '../config/supabase.js'

export async function testDatabaseConnection() {
  const { data, error } = await supabaseAdmin
    .from('destinations')
    .select('id, name')
    .limit(1)

  if (error) {
    throw new Error(`Supabase database error: ${error.message}`)
  }

  return data
}