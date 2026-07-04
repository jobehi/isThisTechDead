const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://axxafyuryepoapvhxqiw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eGFmeXVyeWVwb2Fwdmh4cWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODQzMTQsImV4cCI6MjA2MDA2MDMxNH0.lzZwDTNQ2CiwMIFPDmJiW_jbmbwQksYFLzWkXJhDs0U');
async function test() {
  const { data } = await supabase.from('tech_snapshots_v2').select('*').eq('tech_id', 'go').order('snapshot_date', { ascending: false }).limit(1);
  console.log("github_stars:", data[0].github_stars);
  console.log("github_metrics:", data[0].github_metrics);
  console.log("component_scores:", data[0].component_scores);
}
test();
