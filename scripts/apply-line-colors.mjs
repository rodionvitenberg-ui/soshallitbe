#!/usr/bin/env node
/**
 * Idempotent brand patch for vendor/engine/engine.raw.js:
 *  1) line_reel  → uniform #0b6c79
 *  2) line_goal  → uniform #0b6c79 + earlier timing [0.6, 1.2]
 *  3) EndSection ("Let's work together!") starts earlier: 2.5 → 1.8
 *  4) HomePage background stays light (off-white): no black bg before
 *     "Let's work together!", no white/black flicker on load.
 *  5) WebGL renderer clears to light off-white from the very first frame
 *     (prevents the black flash before the engine's first update()).
 *  6) Reel video pre-expand tint (#1A315B → lighter brand teal #0e93a5).
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
 * If `from` is present → replace with `to` (log it).
 * If `to` already present → skip.
 * Otherwise → error (neither state matched).
 */
function ensureReplace(from, to, label) {
  if (raw.includes(to)) {
    console.log("already applied:", label);
    return;
  }
  if (!raw.includes(from)) {
    console.error(`apply-line-colors: missing site for ${label}`);
    process.exit(1);
  }
  raw = raw.replace(from, to);
  console.log("patched:", label);
}

// 1) line_reel: uniform #0b6c79
ensureReplace(
  'fileName:"line_reel",aoThreshold:.555,margin:{x:-.05,y:-.8},scrollToRatioFactors:[.4,1.3],boxMin:new Vector3(-.0112049,-.0141946,0),boxMax:new Vector3(1.01357,.718671,0),color0:"#5a90ff",color1:"#2a38ee"',
  'fileName:"line_reel",aoThreshold:.555,margin:{x:-.05,y:-.8},scrollToRatioFactors:[.4,1.3],boxMin:new Vector3(-.0112049,-.0141946,0),boxMax:new Vector3(1.01357,.718671,0),color0:"#0b6c79",color1:"#0b6c79"',
  "line_reel color",
);

// 2) line_goal: uniform #0b6c79 + even earlier timing [0.6, 1.2]
ensureReplace(
  'fileName:"line_goal",aoThreshold:1e-4,margin:{x:.2,y:-.6},scrollToRatioFactors:[0.8,1.5],boxMin:new Vector3(-.0180006,-.00963629,0),boxMax:new Vector3(1.01777,.850395,0),color0:"#0b6c79",color1:"#0b6c79"',
  'fileName:"line_goal",aoThreshold:1e-4,margin:{x:.2,y:-.6},scrollToRatioFactors:[0.6,1.2],boxMin:new Vector3(-.0180006,-.00963629,0),boxMax:new Vector3(1.01777,.850395,0),color0:"#0b6c79",color1:"#0b6c79"',
  "line_goal even earlier",
);

// 3) EndSection ("Let's work together!") starts earlier: 2.5 → 1.8
ensureReplace(
  "endSectionActiveThreshold=2.5",
  "endSectionActiveThreshold=1.8",
  "endSection active threshold",
);

// 4) HomePage: always light bg — remove black-bg switch and load flicker.
//    Replaces the screenRatio-based ternary + uiBgColorNeedsOverride with
//    a constant off-white assignment (white text on light stays is-white-bg).
ensureReplace(
  "let t=!0,r=!1,n=!1;scrollManager.getDomRange(homeGoalSection.domContainer).screenRatio==1?(properties.bgColor.setStyle(properties.blackColorHex),t=!1,r=!0):(properties.bgColor.setStyle(properties.offWhiteColorHex),t=!0,r=!1),homeGoalSection.uiBgColorNeedsOverride&&(n=!1,homeGoalSection.isUIBgBlack?(t=!1,r=!0):(t=!0,r=!1)),footerSection.getDomRange().ratio>-.1&&(t=!0,r=!1,n=!1),document.documentElement.classList.toggle(\"is-black-bg\",r),document.documentElement.classList.toggle(\"is-white-bg\",t),document.documentElement.classList.toggle(\"is-blue-bg\",n)",
  "let t=!0,r=!1,n=!1;properties.bgColor.setStyle(properties.offWhiteColorHex),t=!0,r=!1,n=!1,footerSection.getDomRange().ratio>-.1&&(t=!0,r=!1,n=!1),document.documentElement.classList.toggle(\"is-black-bg\",r),document.documentElement.classList.toggle(\"is-white-bg\",t),document.documentElement.classList.toggle(\"is-blue-bg\",n)",
  "home light bg (no black/flicker)",
);

// 5) Renderer clears to light from the very first frame (no black flash).
//    setClearColor alone is not enough — patch-engine also calls renderer.clear()
//    and inits bgColor to off-white (new Color() defaults to black).
ensureReplace(
  "properties.renderer=new WebGLRenderer({canvas:properties.canvas,context:properties.gl,premultipliedAlpha:!1}),properties.scene=new Scene",
  "properties.renderer=new WebGLRenderer({canvas:properties.canvas,context:properties.gl,premultipliedAlpha:!1}),properties.renderer.setClearColor(properties.offWhiteColorHex,1),properties.scene=new Scene",
  "renderer light clearColor",
);

// 5b) If clearColor already applied without clear(), leave raw as-is; patch-engine adds clear().

// 6) Reel video tint before expand: #1A315B (1716219) → #0e93a5 (955301)
ensureReplace(
  "u_color:{value:new Color(1716219)}",
  "u_color:{value:new Color(955301)}",
  "reel video tint",
);

fs.writeFileSync(rawPath, raw);
console.log("wrote", rawPath);