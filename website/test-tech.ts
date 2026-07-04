import { TechRepository } from './src/domains/tech/tech.repository';
import { TechService } from './src/domains/tech/tech.service';

async function run() {
  try {
    const details = await TechService.getTechDetails('flutter');
    const latest = TechService.getLatestSnapshot(details.snapshots);
    console.log(JSON.stringify(latest, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
