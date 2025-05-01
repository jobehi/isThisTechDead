/**
 * Image Service
 * Handles OG image generation for both API routes and build scripts
 */
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { URL } from 'url';
import { formatTechFilename, safeToFixed } from './utils';

export const OG_IMAGE_DIR = path.join(process.cwd(), 'public', 'og-images');

type Logger = {
  info: (message: string) => void;
  success: (message: string) => void;
  error: (message: string, error?: unknown) => void;
};

// Default logger
const defaultLogger: Logger = {
  info: (message: string) => console.log(`ℹ️ ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string, error?: unknown) => console.error(`❌ ${message}`, error || ''),
};

export class ImageService {
  private logger: Logger;
  private siteUrl: string;

  constructor(options?: { logger?: Logger; siteUrl?: string }) {
    this.logger = options?.logger || defaultLogger;
    this.siteUrl = options?.siteUrl || process.env.SITE_URL || 'http://localhost:3000';
  }

  /**
   * Ensure the OG images directory exists
   */
  ensureDirectoryExists(): void {
    if (!fs.existsSync(OG_IMAGE_DIR)) {
      fs.mkdirSync(OG_IMAGE_DIR, { recursive: true });
      this.logger.info(`Created directory: ${OG_IMAGE_DIR}`);
    }
  }

  /**
   * Download an image from a URL
   * @param url The URL to download the image from
   * @param filepath The path to save the image to
   * @returns Promise that resolves when the image is downloaded
   */
  downloadImage(url: string, filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.logger.info(`Downloading from: ${url}`);

      const protocol = https

      const options = new URL(url);

      const req = protocol.get(options, response => {
        // Handle redirects
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          this.logger.info(`Following redirect to: ${response.headers.location}`);
          return this.downloadImage(response.headers.location, filepath)
            .then(resolve)
            .catch(reject);
        }

        // Check if the response is successful
        if (!response.statusCode || response.statusCode !== 200) {
          return reject(new Error(`Failed to download image: ${response.statusCode}`));
        }

        // Create a write stream to save the image
        const fileStream = fs.createWriteStream(filepath);

        // Pipe the response to the file
        response.pipe(fileStream);

        // Handle errors
        fileStream.on('error', err => {
          fs.unlink(filepath, () => {}); // Delete the file on error
          reject(err);
        });

        // Handle completion
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
      });

      req.on('error', err => {
        reject(err);
      });

      // Set a timeout
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });
    });
  }

  /**
   * Generate the fallback OG image
   * @returns Promise that resolves when the image is generated
   */
  async generateFallbackOGImage(): Promise<string> {
    this.logger.info('Generating fallback OG image...');
    this.ensureDirectoryExists();

    const apiUrl = `${this.siteUrl}/api/og?tech=Technology&score=Unknown`;
    const filepath = path.join(OG_IMAGE_DIR, 'fallback.png');

    try {
      await this.downloadImage(apiUrl, filepath);
      this.logger.success('Fallback OG image generated successfully!');
      return 'fallback.png';
    } catch (error) {
      this.logger.error('Failed to generate fallback OG image:', error);
      throw error;
    }
  }

  /**
   * Generate an OG image for a tech
   * @param techName The name of the technology
   * @param score The deaditude score (0-100)
   * @returns Promise that resolves to the filename of the generated image
   */
  async generateTechOGImage(techName: string, score: number | null): Promise<string> {
    this.ensureDirectoryExists();

    const scoreFormatted = score !== null ? safeToFixed(score, 1) : 'Unknown';
    const filename = formatTechFilename(techName, scoreFormatted);
    const filepath = path.join(OG_IMAGE_DIR, `${filename}.png`);

    try {
      const apiUrl = `${this.siteUrl}/api/og?tech=${encodeURIComponent(techName)}&score=${encodeURIComponent(scoreFormatted)}`;

      // Download the image from the API : Normally it should only be from https://www.isthistechdead.com
      await this.downloadImage(apiUrl, filepath);
      this.logger.success(`Generated OG image for ${techName}: ${filename}.png`);
      return `${filename}.png`;
    } catch (error) {
      this.logger.error(`Error generating OG image for ${techName}:`, error);
      throw error;
    }
  }
}
