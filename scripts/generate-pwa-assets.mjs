import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const iconSvg = await readFile(path.join(root, "public/icons/icon.svg"));
const iconsDir = path.join(root, "public/icons");
const splashDir = path.join(root, "public/splash");

await mkdir(iconsDir, { recursive: true });
await mkdir(splashDir, { recursive: true });

const iconSizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

for (const size of iconSizes) {
  await sharp(iconSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
}

await sharp(iconSvg)
  .resize(512, 512)
  .extend({
    top: 64,
    bottom: 64,
    left: 64,
    right: 64,
    background: { r: 3, g: 3, b: 4, alpha: 1 },
  })
  .png()
  .toFile(path.join(iconsDir, "icon-maskable-512x512.png"));

await sharp(iconSvg).resize(180, 180).png().toFile(path.join(iconsDir, "apple-touch-icon.png"));

await sharp(iconSvg).resize(32, 32).png().toFile(path.join(iconsDir, "favicon-32x32.png"));

const splashScreens = [
  {
    file: "iphone-14-pro-max-portrait.png",
    width: 1290,
    height: 2796,
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    file: "iphone-14-pro-portrait.png",
    width: 1179,
    height: 2556,
    media:
      "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    file: "iphone-14-portrait.png",
    width: 1170,
    height: 2532,
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    file: "iphone-13-portrait.png",
    width: 1284,
    height: 2778,
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    file: "iphone-se-portrait.png",
    width: 750,
    height: 1334,
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    file: "ipad-pro-12-portrait.png",
    width: 2048,
    height: 2732,
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    file: "ipad-pro-12-landscape.png",
    width: 2732,
    height: 2048,
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
];

const iconBuffer = await sharp(iconSvg).resize(256, 256).png().toBuffer();

for (const screen of splashScreens) {
  const iconSize = Math.round(Math.min(screen.width, screen.height) * 0.22);
  const splashIcon = await sharp(iconBuffer).resize(iconSize, iconSize).png().toBuffer();

  await sharp({
    create: {
      width: screen.width,
      height: screen.height,
      channels: 4,
      background: { r: 3, g: 3, b: 4, alpha: 1 },
    },
  })
    .composite([{ input: splashIcon, gravity: "center" }])
    .png()
    .toFile(path.join(splashDir, screen.file));
}

const manifest = {
  splashScreens: splashScreens.map((screen) => ({
    href: `/splash/${screen.file}`,
    media: screen.media,
  })),
};

await writeFile(
  path.join(root, "src/lib/pwa/generated-splash-screens.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log("Generated PWA icons and splash screens.");
