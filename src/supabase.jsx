import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynbmoyesuqpnumfqxbvj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYm1veWVzdXFwbnVtZnF4YnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE4ODU3NzksImV4cCI6MTk4NzQ2MTc3OX0.5p_oitd5FvM86QE29UxXnM7mViVoKVFk-Z9FR9XWTXo';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
