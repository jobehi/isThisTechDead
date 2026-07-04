import { TechService } from './src/domains/tech/tech.service';
import config from './src/lib/config';

async function main() {
  const details = await TechService.getTechDetails('go');
  const latestSnapshot = TechService.getLatestSnapshot(details.snapshots);
  console.log("github_stars:", latestSnapshot?.github_stars);
  console.log("github_metrics:", latestSnapshot?.github_metrics);
  console.log("deaditude_score:", latestSnapshot?.deaditude_score);
}
main().catch(console.error);
