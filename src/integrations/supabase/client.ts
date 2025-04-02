
// This file provides a mock Supabase client for demonstration purposes
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eabrsugmhzvkfdnshpxg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYnJzdWdtaHp2a2ZkbnNocHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTI2OTEsImV4cCI6MjA1OTA4ODY5MX0.YGuUKPFKchVe8yR1YncxqI_WiNgyvroD8RB-TGTVAkE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
