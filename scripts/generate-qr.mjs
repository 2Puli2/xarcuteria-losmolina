import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import QRCode from 'qrcode';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetUrl = 'https://www.xarcuterialosmolina.com/carta';
const logoPath = path.join(rootDir, 'public', 'Screenshot_11-2-2026_14541_www.google.es.jpeg');
const outputPath = path.join(rootDir, 'public', 'images', 'qr-carta-los-molina.png');

const qrSize = 1400;
const logoMaxWidth = 360;
const logoMaxHeight = 240;
const logoBackgroundSize = 430;

async function ensureParentDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function createQrBase() {
  return QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: qrSize,
    color: {
      dark: '#000000',
      light: '#FFFFFFFF',
    },
  });
}

async function createLogoOverlay() {
  const metadata = await sharp(logoPath).metadata();

  const width = metadata.width ?? 1080;
  const height = metadata.height ?? 675;
  const safeLeft = Math.max(0, Math.min(Math.round(width * 0.08), width - 1));
  const safeTop = Math.max(0, Math.min(Math.round(height * 0.18), height - 1));
  const safeWidth = Math.max(1, Math.min(Math.round(width * 0.84), width - safeLeft));
  const safeHeight = Math.max(1, Math.min(Math.round(height * 0.64), height - safeTop));

  const cropped = await sharp(logoPath)
    .extract({
      left: safeLeft,
      top: safeTop,
      width: safeWidth,
      height: safeHeight,
    })
    .flatten({ background: '#FFFFFF' })
    .resize({
      width: logoMaxWidth,
      height: logoMaxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();

  const logoMetadata = await sharp(cropped).metadata();
  const logoWidth = logoMetadata.width ?? logoMaxWidth;
  const logoHeight = logoMetadata.height ?? logoMaxHeight;

  const logoCard = await sharp({
    create: {
      width: logoBackgroundSize,
      height: logoBackgroundSize,
      channels: 4,
      background: '#FFFFFF',
    },
  })
    .composite([
      {
        input: {
          create: {
            width: logoBackgroundSize,
            height: logoBackgroundSize,
            channels: 4,
            background: '#FFFFFF',
          },
        },
        blend: 'dest-over',
      },
      {
        input: cropped,
        left: Math.round((logoBackgroundSize - logoWidth) / 2),
        top: Math.round((logoBackgroundSize - logoHeight) / 2),
      },
    ])
    .png()
    .toBuffer();

  return sharp(logoCard)
    .resize({
      width: logoBackgroundSize,
      height: logoBackgroundSize,
      fit: 'contain',
    })
    .png()
    .toBuffer();
}

async function main() {
  await ensureParentDir(outputPath);

  const [qrBase, logoOverlay] = await Promise.all([createQrBase(), createLogoOverlay()]);

  await sharp(qrBase)
    .composite([
      {
        input: await sharp({
          create: {
            width: logoBackgroundSize,
            height: logoBackgroundSize,
            channels: 4,
            background: '#FFFFFF',
          },
        })
          .png()
          .toBuffer(),
        gravity: 'centre',
      },
      {
        input: logoOverlay,
        gravity: 'centre',
      },
    ])
    .png()
    .toFile(outputPath);

  console.log(`QR generado en: ${outputPath}`);
  console.log(`URL: ${targetUrl}`);
}

main().catch((error) => {
  console.error('No se pudo generar el QR:', error);
  process.exitCode = 1;
});
