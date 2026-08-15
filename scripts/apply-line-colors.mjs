#!/usr/bin/env node
/**
 * Idempotent brand patch for vendor/engine/engine.raw.js:
 *  1) line_reel  → uniform #366894 (deep blue — first strip)
 *  2) line_goal  → uniform #e19386 (soft coral — second strip) + earlier timing [0.6, 1.2]
 *  3) EndSection ("Let's work together!") starts earlier: 2.5 → 1.8
 *  4) HomePage background stays light (off-white): no black bg before
 *     "Let's work together!", no white/black flicker on load.
 *  5) WebGL renderer clears to light off-white from the very first frame
 *     (prevents the black flash before the engine's first update()).
 *  6) Reel video pre-expand tint (#1A315B → soft coral #e19386).
 * Safe to re-run: already-applied values are left untouched.
 * After this, run `node scripts/patch-engine.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawPath = path.join(root, "vendor/engine/engine.raw.js");

let raw = fs.readFileSync(rawPath, "utf8");

/**
 * If `to` already present → skip (idempotent).
 * Otherwise try each `from` in order; first match is replaced.
 * If none match → error (neither state matched).
 */
function ensureOneOf(froms, to, label) {
  if (raw.includes(to)) {
    console.log("already applied:", label);
    return;
  }
  for (const from of froms) {
    if (raw.includes(from)) {
      raw = raw.replace(from, to);
      console.log("patched:", label);
      return;
    }
  }
  console.error(`apply-line-colors: missing site for ${label}`);
  process.exit(1);
}

// 1) line_reel: uniform #366894 (migrates both #0b6c79 and legacy #FF5C00)
ensureOneOf(
  [
    'fileName:"line_reel",aoThreshold:.555,margin:{x:-.05,y:-.8},scrollToRatioFactors:[.4,1.3],boxMin:new Vector3(-.0112049,-.0141946,0),boxMax:new Vector3(1.01357,.718671,0),color0:"#0b6c79",color1:"#0b6c79"',
    'fileName:"line_reel",aoThreshold:.555,margin:{x:-.05,y:-.8},scrollToRatioFactors:[.4,1.3],boxMin:new Vector3(-.0112049,-.0141946,0),boxMax:new Vector3(1.01357,.718671,0),color0:"#FF5C00",color1:"#FF5C00"',
  ],
  'fileName:"line_reel",aoThreshold:.555,margin:{x:-.05,y:-.8},scrollToRatioFactors:[.4,1.3],boxMin:new Vector3(-.0112049,-.0141946,0),boxMax:new Vector3(1.01357,.718671,0),color0:"#366894",color1:"#366894"',
  "line_reel color → #366894",
);

// 2) line_goal: uniform #e19386 + even earlier timing [0.6, 1.2]
//    Migrates both #0b6c79 and legacy #1F51FF.
ensureOneOf(
  [
    'fileName:"line_goal",aoThreshold:1e-4,margin:{x:.2,y:-.6},scrollToRatioFactors:[0.6,1.2],boxMin:new Vector3(-.0180006,-.00963629,0),boxMax:new Vector3(1.01777,.850395,0),color0:"#0b6c79",color1:"#0b6c79"',
    'fileName:"line_goal",aoThreshold:1e-4,margin:{x:.2,y:-.6},scrollToRatioFactors:[0.6,1.2],boxMin:new Vector3(-.0180006,-.00963629,0),boxMax:new Vector3(1.01777,.850395,0),color0:"#1F51FF",color1:"#1F51FF"',
  ],
  'fileName:"line_goal",aoThreshold:1e-4,margin:{x:.2,y:-.6},scrollToRatioFactors:[0.6,1.2],boxMin:new Vector3(-.0180006,-.00963629,0),boxMax:new Vector3(1.01777,.850395,0),color0:"#e19386",color1:"#e19386"',
  "line_goal color → #e19386",
);

// 3) EndSection ("Let's work together!") starts earlier: 2.5 → 1.8
ensureOneOf(
  ["endSectionActiveThreshold=2.5"],
  "endSectionActiveThreshold=1.8",
  "endSection active threshold",
);

// 4) HomePage: always light bg — remove black-bg switch and load flicker.
//    Replaces the screenRatio-based ternary + uiBgColorNeedsOverride with
//    a constant off-white assignment (white text on light stays is-white-bg).
ensureOneOf(
  [
    "let t=!0,r=!1,n=!1;scrollManager.getDomRange(homeGoalSection.domContainer).screenRatio==1?(properties.bgColor.setStyle(properties.blackColorHex),t=!1,r=!0):(properties.bgColor.setStyle(properties.offWhiteColorHex),t=!0,r=!1),homeGoalSection.uiBgColorNeedsOverride&&(n=!1,homeGoalSection.isUIBgBlack?(t=!1,r=!0):(t=!0,r=!1)),footerSection.getDomRange().ratio>-.1&&(t=!0,r=!1,n=!1),document.documentElement.classList.toggle(\"is-black-bg\",r),document.documentElement.classList.toggle(\"is-white-bg\",t),document.documentElement.classList.toggle(\"is-blue-bg\",n)",
  ],
  "let t=!0,r=!1,n=!1;properties.bgColor.setStyle(properties.offWhiteColorHex),t=!0,r=!1,n=!1,footerSection.getDomRange().ratio>-.1&&(t=!0,r=!1,n=!1),document.documentElement.classList.toggle(\"is-black-bg\",r),document.documentElement.classList.toggle(\"is-white-bg\",t),document.documentElement.classList.toggle(\"is-blue-bg\",n)",
  "home light bg (no black/flicker)",
);

// 5) Renderer clears to light from the very first frame (no black flash).
//    setClearColor alone is not enough — patch-engine also calls renderer.clear()
//    and inits bgColor to off-white (new Color() defaults to black).
ensureOneOf(
  ["properties.renderer=new WebGLRenderer({canvas:properties.canvas,context:properties.gl,premultipliedAlpha:!1}),properties.scene=new Scene"],
  "properties.renderer=new WebGLRenderer({canvas:properties.canvas,context:properties.gl,premultipliedAlpha:!1}),properties.renderer.setClearColor(properties.offWhiteColorHex,1),properties.scene=new Scene",
  "renderer light clearColor",
);

// 5b) If clearColor already applied without clear(), leave raw as-is; patch-engine adds clear().

// 6) Reel video tint before expand → soft coral #e19386 (14783366).
//    Migrates both #0e93a5 (955301) and legacy #1F51FF (2052607).
ensureOneOf(
  [
    "u_color:{value:new Color(955301)}",
    "u_color:{value:new Color(2052607)}",
  ],
  "u_color:{value:new Color(14783366)}",
  "reel video tint → #e19386",
);

fs.writeFileSync(rawPath, raw);
console.log("wrote", rawPath);