import { createClient } from '@supabase/supabase-js'

// Maintenant tu peux utiliser les variables
const supabaseUrl = "https://qbrulgnxehgmxncgywyn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicnVsZ254ZWhnbXhuY2d5d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDEzODgsImV4cCI6MjA1NzMxNzM4OH0.72WLRjklPrW8Yw72lMJdNvPCPTEghOnlnn_PHyYUq7U"

export const supabase = createClient(supabaseUrl, supabaseKey)
