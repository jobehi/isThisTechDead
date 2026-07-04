const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: full } = await supabase
    .from('tech_snapshots_v2')
    .select('*')
    .eq('tech_id', 'flutter')
    .order('snapshot_date', { ascending: false })
    .limit(1);
  console.log('FULL:', full[0].github_stars, full[0].snapshot_date);

  const { data: light } = await supabase
    .from('tech_snapshots_v2')
    .select('id, tech_id, snapshot_date, deaditude_score')
    .eq('tech_id', 'flutter')
    .order('snapshot_date', { ascending: false })
    .limit(2);
  console.log(
    'LIGHT:',
    light.map(l => l.snapshot_date)
  );
}
run();
