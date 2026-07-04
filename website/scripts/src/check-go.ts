import { supabase } from '../../src/lib/supabase';
async function run() {
  const { data } = await supabase.from('tech_registry_v2').select('*, snapshots:tech_snapshots_v2(*)').eq('id', 'go').single();
  console.log(JSON.stringify(data, null, 2));
}
run();
