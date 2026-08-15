#!/usr/bin/env node
/**
 * Generate the OG/Twitter social sharing image (1200×630) for the
 * So Shall It Be brand — off-white bg, "AS YOU DREAME, / SO SHALL IT BE."
 * wordmark + domain, matching the header logo. No lusion references.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "public/assets/meta/social_sharing.jpg");

const W = 1200;
const H = 630;

// Light off-white brand background
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f0f1fa"/>
  <text x="${W / 2}" y="278" text-anchor="middle"
        font-family="Aeonik, Helvetica, Arial, sans-serif" font-weight="500"
        font-size="86" letter-spacing="2" fill="#141515">AS YOU DREAME,</text>
  <text x="${W / 2}" y="392" text-anchor="middle"
        font-family="Aeonik, Helvetica, Arial, sans-serif" font-weight="500"
        font-size="86" letter-spacing="2" fill="#141515">SO SHALL IT BE.</text>
  <line x1="${W / 2 - 220}" y1="452" x2="${W / 2 + 220}" y2="452"
        stroke="#e19386" stroke-width="4" stroke-linecap="round"/>
  <text x="${W / 2}" y="512" text-anchor="middle"
        font-family="IBMPlexMono, Menlo, monospace" font-weight="400"
        font-size="30" letter-spacing="8" fill="#5c6470">SOSHALLITBE.CYOU</text>
</svg>
`;

const tmp = path.join(root, ".social-share.svg");
fs.writeFileSync(tmp, svg);

const { default: sharp } = await import("sharp");
await sharp(tmp, { density: 200 })
  .resize(W, H)
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outPath);

fs.unlinkSync(tmp);
console.log("wrote", outPath);