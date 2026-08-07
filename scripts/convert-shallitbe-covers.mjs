#!/usr/bin/env node
/**
 * One-off script: replaces homepage project covers with the new screenshots.
 *
 * For each (screenshot → project folder) pair:
 *   1. home.webp       — screenshot resized to 1200×900 (cover crop), WebP q80
 *   2. home_depth.webp — regenerated depth map (luminance + edge emphasis)
 *                        so the engine WebGL parallax matches the new cover.
 *
 * The engine loads /assets/projects/<id>/home.webp and home_depth.webp
 * (see ProjectItem in vendor/engine/engine.raw.js).
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public', 'assets', 'shallitbe');
const PROJECTS_DIR = path.join(ROOT, 'public', 'assets', 'projects');

const W = 1200;
const H = 900;
const COVER_Q = 80; // "оптимизировать, но не давить до безумия"
const DEPTH_Q = 60; // depth is a smooth grayscale texture — high quality is wasted

/** Source screenshot (by domain in its name) → target project folder. */
const MAPPING = [
  { src: 'FireShot Capture 048 - Daerdree Bar & Timeclub — Best Bar & Timeclub in Cyprus - [daerdree.bar] (1).png', project: 'oryzo_ai' },
  { src: 'FireShot Capture 049 - Dastorkon Etno-Cafe - [iksoft.pro].png', project: 'of_the_oak' },
  { src: 'FireShot Capture 051 - Walmgres Investment - [walmgres-8c8z.vercel.app].png', project: 'devin_ai' },
  { src: 'FireShot Capture 052 - IkSoft - [rvstudio-ten.vercel.app].png', project: 'porsche_dream_machine' },
  { src: 'FireShot Capture 053 - Webdoc.life - AI Lab Test Interpretation - [webdoc.life] (1).png', project: 'synthetic_human' },
  { src: 'FireShot Capture 054 - CareYour.Pet — Pet Health Management Platform - [careyour.pet].png', project: 'spatial_fusion' },
  { src: 'FireShot Capture 056 - ProffMusic - Professional original music - [proffmusic.shop].png', project: 'spaace' },
  { src: 'FireShot Capture 057 - Империя Электроники — Каракол - [el-imperia.shop] (1).png', project: 'ddd_2024' },
  { src: "FireShot Capture 058 - Father's Garden — Питомник и гостевой дом в Кызыл-Суу - [maintest.site].png", project: 'choo_choo_world' },
  { src: 'FireShot Capture 059 - Bimark - Продажа готового бизнеса - [maintest.site].png', project: 'soda_experience' },
];

const fmt = (n) => `${(n / 1024).toFixed(1)} KB`;

/** Build a smooth depth map: brightness ≈ luminance, edges (UI/text) pop. */
async function makeDepthMap(coverBuffer) {
  // Soft luminance base — flat areas recede.
  const luminance = await sharp(coverBuffer)
    .greyscale()
    .normalize()
    .blur(2.5)
    .toBuffer();

  // Edge (high-pass) layer — text/buttons/borders advance toward the viewer.
  const edges = await sharp(coverBuffer)
    .greyscale()
    .normalize()
    .convolve({
      width: 3,
      height: 3,
      kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0],
      scale: 1,
      offset: 128, // keep zero-crossings mid-gray
    })
    .toBuffer();

  return sharp(luminance)
    .composite([{ input: edges, blend: 'over', opacity: 0.5 }])
    .normalize()
    .flatten({ background: '#000000' })
    .webp({ quality: DEPTH_Q, effort: 4 })
    .toBuffer();
}

async function main() {
  const missing = [];
  for (const { src } of MAPPING) {
    if (!fs.existsSync(path.join(SRC_DIR, src))) missing.push(src);
  }
  if (missing.length) {
    console.error('Missing source files:\n' + missing.map((m) => '  - ' + m).join('\n'));
    process.exit(1);
  }

  let ok = 0;
  for (const { src, project } of MAPPING) {
    const srcPath = path.join(SRC_DIR, src);
    const destDir = path.join(PROJECTS_DIR, project);
    const coverPath = path.join(destDir, 'home.webp');
    const depthPath = path.join(destDir, 'home_depth.webp');

    if (!fs.existsSync(destDir)) {
      console.error(`  SKIP  ${project}: folder ${destDir} does not exist`);
      continue;
    }

    const oldCover = fs.existsSync(coverPath) ? fs.statSync(coverPath).size : 0;
    const oldDepth = fs.existsSync(depthPath) ? fs.statSync(depthPath).size : 0;
    const srcSize = fs.statSync(srcPath).size;

    const cover = await sharp(srcPath)
      .resize(W, H, { fit: 'cover', position: 'centre' })
      .webp({ quality: COVER_Q, effort: 6 })
      .toBuffer();

    const depth = await makeDepthMap(
      await sharp(srcPath).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer()
    );

    fs.writeFileSync(coverPath, cover);
    fs.writeFileSync(depthPath, depth);

    const newCover = fs.statSync(coverPath).size;
    const newDepth = fs.statSync(depthPath).size;
    console.log(
      `  OK   ${project.padEnd(20)} ` +
        `png ${fmt(srcSize)} → cover ${fmt(newCover)} (was ${fmt(oldCover)}) | ` +
        `depth ${fmt(newDepth)} (was ${fmt(oldDepth)})`
    );
    ok++;
  }

  console.log(`\nDone: ${ok}/${MAPPING.length} covers replaced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});