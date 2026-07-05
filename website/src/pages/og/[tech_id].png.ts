import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { TechService } from '../../domains/tech/tech.service';
import type { APIRoute } from 'astro';

// Read the font from local node_modules
const fontPath = path.resolve('./node_modules/@fontsource/lora/files/lora-latin-400-normal.woff');
const fontData = fs.readFileSync(fontPath);

export async function getStaticPaths() {
  const techs = await TechService.getAllTechs();
  return techs.map((tech) => ({
    params: { tech_id: tech.id },
    props: { tech },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { tech } = props as any;
  const details = await TechService.getTechDetails(tech.id);
  const snap = TechService.getLatestSnapshot(details.snapshots);
  
  const score = snap ? snap.deaditude_score : 0;
  const label = TechService.getRatingLabel(score);
  
  const safeLabel = label.replace(/&/g, 'and');
  
  const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #fcfbf8; color: #111111; padding: 40px; justify-content: center; align-items: center; border: 20px solid #222222; font-family: 'Lora'; box-sizing: border-box;">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; border: 4px solid #333; padding: 40px; width: 100%; height: 100%; box-sizing: border-box;">
        
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1;">
          <div style="font-size: 80px; font-weight: 700; text-align: center; font-style: italic; color: #333; margin-bottom: 20px;">
            ${tech.name}
          </div>
          
          <div style="display: flex; align-items: baseline; justify-content: center; margin-bottom: 30px;">
            <div style="font-size: 160px; font-weight: 700; color: #111; line-height: 1;">
              ${score}%
            </div>
            <div style="font-size: 50px; font-weight: 700; color: #444; margin-left: 15px; text-transform: uppercase;">
              Dead
            </div>
          </div>
          
          <div style="display: flex; font-size: 35px; color: #555; text-align: center; font-style: italic; border: 2px solid #555; padding: 10px 30px; border-radius: 8px;">
            Verdict: ${safeLabel}
          </div>
        </div>

        <div style="display: flex; width: 100%; justify-content: center; font-size: 24px; color: #666; letter-spacing: 4px; font-weight: bold; margin-top: 20px;">
          ISTHISTECHDEAD.COM
        </div>

      </div>
    </div>
  `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Lora',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
