#!/usr/bin/env node
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COVERS = path.join(ROOT, "covers");
const PROJ = path.join(ROOT, "public", "assets", "projects");
const W = 1600, H = 900;

// Новые обложки: исходный файл в covers/ → id проекта.
const MAPPING = [
  ["bimark_new.jpeg", "soda_experience"],
  ["gardenhouse.png", "choo_choo_world"],
  ["imperia.png", "ddd_2024"],
  ["lemansion.png", "lamaison"],
  ["proffmusic.jpeg", "spaace"],
  ["walmgres.png", "devin_ai"],
  ["maintest.png", "maintest"],
  ["newwebdoc.jpeg", "synthetic_human"],
];

async function depthMap(buf) {
  const lum = await sharp(buf).greyscale().normalize().blur(2.5).toBuffer();
  const edges = await sharp(buf)
    .greyscale().normalize()
    .convolve({ width: 3, height: 3, kernel: [0,-1,0,-1,4,-1,0,-1,0], scale: 1, offset: 128 })
    .toBuffer();
  return sharp(lum)
    .composite([{ input: edges, blend: "over", opacity: 0.5 }])
    .normalize().flatten({ background: "#000000" })
    .webp({ quality: 55, effort: 4 })
    .toBuffer();
}

let ok = 0;
for (const [src, proj] of MAPPING) {
  const srcPath = path.join(COVERS, src);
  const dir = path.join(PROJ, proj);
  if (!fs.existsSync(srcPath)) { console.error("MISSING:", srcPath); continue; }
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const base = await sharp(srcPath).resize(W, H, { fit: "cover", position: "centre" }).toBuffer();
  // Сжатие: WebP q70 — заметно легче png/jpeg-исходников.
  const cover = await sharp(base).webp({ quality: 70, effort: 6 }).toBuffer();
  const depth = await depthMap(base);

  fs.writeFileSync(path.join(dir, "home.webp"), cover);
  fs.writeFileSync(path.join(dir, "home_depth.webp"), depth);
  console.log("OK", proj, `${(cover.length/1024).toFixed(1)}KB`, `${(depth.length/1024).toFixed(1)}KB`);
  ok++;
}
console.log(`\nDone: ${ok}/${MAPPING.length}`);