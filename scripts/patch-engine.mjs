#!/usr/bin/env node
/**
 * Patch vendor/engine/engine.raw.js → public/_astro/engine.js
 *
 * - USE_AUDIO forced off (no music / SFX)
 * - Goal tunnel timeline + GoalTunnelAstronauts disabled (no long tunnel / astronaut flight)
 * - ScrollNavSection neutralized (no black “Next Page” overscroll section)
 * - Preloader UI removed: still runs loader → init/start callbacks without #preloader DOM
 * - TransitionOverlay neutralized: no black load/transition canvas
 * - Anti-flash load: delay html.is-ready (shows #canvas) until start(); init bgColor/clear to off-white
 * - Keeps GoalSection copy (#home-goal-context) working with stub DOM nodes
 * - Footer is present (contact section) — do not no-op FooterSection
 *
 * Production bundle uses comma-chained const declarations — preserve them.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawPath = path.join(root, "vendor/engine/engine.raw.js");
const outPath = path.join(root, "public/_astro/engine.js");

let raw = fs.readFileSync(rawPath, "utf8");

function mustReplace(from, to, label) {
  if (!raw.includes(from)) {
    console.error(`patch-engine: missing site for ${label}`);
    process.exit(1);
  }
  raw = raw.replace(from, to);
  console.log("patched:", label);
}

// 1) Kill audio entirely
mustReplace(
  "USE_AUDIO=browser$1.isSupportOgg&&!browser$1.isMobile",
  "USE_AUDIO=!1",
  "USE_AUDIO=false",
);

// 2) Neutralize GoalTunnelAstronauts (comma-chained with blockVert)
mustReplace(
  "const goalTunnelAstronauts=new GoalTunnelAstronauts,",
  "const goalTunnelAstronauts=(()=>{const a=new GoalTunnelAstronauts;" +
    "const n=function(){return a};a.preInit=n;a.init=n;a.resize=n;a.update=function(){};" +
    "a.resetAstronautLayer=function(){};if(a.container)a.container.visible=!1;return a})(),",
  "goalTunnelAstronauts",
);

// 3) Neutralize goalTunnels (comma-chained with frameBgVert)
mustReplace(
  "const goalTunnels=new GoalTunnels,",
  "const goalTunnels=(()=>{const g=new GoalTunnels;" +
    "const n=function(){return g};g.preInit=n;g.init=n;g.resize=n;" +
    "g.update=function(){g.isActive=!1};" +
    "g.updateRatios=function(){g.isActive=!1;" +
    "g.blackFrameInRatio=g.blackTitleRatio=g.blackTunnelRatio=0;" +
    "g.whiteTunnelRatio=g.whiteFrameOutRatio=g.whiteFrameBreakRatio=0;" +
    "g.astronautDropRatio=g.whiteTunnelAstronautRatio=g.freezeRatio=0;" +
    "g.isBlackTunnelActive=g.isWhiteTunnelActive=!1;};" +
    "g.resetAstronautLayer=function(){};" +
    "g.isActive=!1;return g})(),",
  "goalTunnels",
);

// 4) Collapse tunnel scroll ranges (comma-chained with vert$e)
mustReplace(
  "const homeGoalSectionRanges=new GoalSectionRanges,",
  "const homeGoalSectionRanges=(()=>{const r=new GoalSectionRanges;" +
    "r.init=function(e){this.domContainer=e&&e.querySelector&&e.querySelector('#home-goal');" +
    "this.domImgIn=this.domContainer&&this.domContainer.querySelector('#home-goal-image-in');" +
    "this.domImgOut=this.domContainer&&this.domContainer.querySelector('#home-goal-image-out');" +
    "this.itemList=[];this.items={};this.totalTunnelWeight=0;this.totalPixelCount=0;};" +
    "r.resize=function(){this.totalPixelCount=0;this.isActive=!1;this.ratio=-1;this.offsetY=0;};" +
    "r.update=function(){this.isActive=!1;this.wasActive=!1;this.ratio=-1;};" +
    "r.getRange=function(){return 0;};return r})(),",
  "homeGoalSectionRanges",
);

// 5) Tunnel title no-op (comma-chained)
mustReplace(
  "const homeGoalSectionTunnelTitle=new HomeGoalSectionTunnelTitle,",
  "const homeGoalSectionTunnelTitle=(()=>{const t=new HomeGoalSectionTunnelTitle;" +
    "const n=function(){return t};t.init=n;t.resize=n;t.update=function(){};return t})(),",
  "homeGoalSectionTunnelTitle",
);

// 6) Don't attach astronaut container
if (raw.includes("homePage.preUfxContainer.add(goalTunnelAstronauts.container)")) {
  raw = raw.replace(
    "homePage.preUfxContainer.add(goalTunnelAstronauts.container)",
    "/* astronaut disabled */0",
  );
  console.log("patched: preUfx astronaut add");
}

// 6b) Neutralize home balloons (heavy hero WebGL) — replaced by Topography React background
mustReplace(
  "const homeBalloons=new HomeBalloons;",
  "const homeBalloons=(()=>{const h=new HomeBalloons;" +
    "const n=function(){return h};" +
    "const noopSig={add:function(){},dispatch:function(){}};" +
    "h.preInit=n;h.init=n;h.resize=n;" +
    "h.update=function(){this.isActive=!1};" +
    "h.isActive=!1;h.ratio=0;" +
    "h.changeHomeHeroColorSignal=noopSig;" +
    "return h})();",
  "homeBalloons",
);

// Skip pushing balloons into stage3D list (still call preInit no-op)
if (raw.includes("visuals.stage3DList.push(homeBalloons),homeBalloons.preInit()")) {
  raw = raw.replace(
    "visuals.stage3DList.push(homeBalloons),homeBalloons.preInit()",
    "homeBalloons.preInit()",
  );
  console.log("patched: stage3D balloons push removed");
}


// 7) Neutralize ScrollNavSection — product has no black “Next Page” block.
//    update() writes barInner styles / navigates on overscroll; missing DOM would throw.
mustReplace(
  "const scrollNavSection=new ScrollNavSection;",
  "const scrollNavSection=(()=>{const s=new ScrollNavSection;" +
    "const n=function(){return s};" +
    "s.preInit=n;s.init=n;s.resize=n;s.update=function(){this.overScrollRatio=0;};" +
    "s.domContainer=null;return s})();",
  "scrollNavSection",
);

// 7b) RouteManager._initDom always called a.removeAttribute even when #scroll-nav-section
//     is missing — that aborted boot (only hero visible: #ui stays fixed, no virtual scroll).
mustReplace(
  ',a.removeAttribute("data-path"),this._attachEvents',
  ",a&&a.removeAttribute(\"data-path\"),this._attachEvents",
  "RouteManager scroll-nav null-safe",
);

// 8) Preloader without UI — still drives loader → init() → start() boot sequence.
//    Original update writes digit DOM + hides #preloader; both are gone in product UI.
mustReplace(
  "const preloader=new Preloader;",
  "const preloader=(()=>{const p=new Preloader;" +
    "const n=function(){return p};" +
    "p.preInit=n;p.init=n;p.hide=n;p.resize=n;" +
    "p.show=function(initCb,startCb){" +
      "this.isActive=!0;this._initCallback=initCb;this._startCallback=startCb;" +
      "this.percentTarget=0;" +
      "properties.loader.start(r=>{this.percentTarget=r});" +
    "};" +
    "p.update=function(){" +
      "if(!this.isActive)return;" +
      "if(this.percentTarget<1)return;" +
      "if(!properties.hasInitialized&&this._initCallback)this._initCallback();" +
      "if(properties.hasInitialized&&!properties.hasStarted&&this._startCallback)this._startCallback();" +
      "if(properties.hasStarted)this.isActive=!1;" +
    "};" +
    "return p})();",
  "preloader",
);

// 9) No black transition overlay canvas — keep PageManager text-transition signals alive.
mustReplace(
  "const transitionOverlay=new TransitionOverlay;",
  "const transitionOverlay=(()=>{const o=new TransitionOverlay;" +
    "o.contentShowRatio=1;o.contentHideRatio=0;o.loadBarRatio=1;o.lineTransformRatio=1;" +
    "o.init=function(){};o.resize=function(){};" +
    "o.update=function(){" +
      "if(this.needsShowText){" +
        "this.showTextRatio=1;this.needsShowText=!1;this.onShowTextCompleted.dispatch();" +
      "}" +
      "if(this.needsHideText){" +
        "this.waitTextRatio=1;this.hideTextRatio=1;this.needsHideText=!1;this.onHideTextCompleted.dispatch();" +
      "}" +
      // Never paint a full-screen black cover (boot or route change).
      "this.contentShowRatio=1;this.contentHideRatio=0;" +
    "};" +
    "return o})();",
  "transitionOverlay",
);

// 10) Soft-guard: GoalSection should not push goalTunnels into stage if disabled — already no-op update

// 11) Vimeo oEmbed can fail (network / blocked / private video) and surface as Next runtime overlay.
// Soft-fail: never reject getOEmbedData; skip createEmbed when there is no html.
mustReplace(
  "function createEmbed(o,e){let{html:t}=o;if(!e)throw new TypeError(\"An element must be provided\");",
  "function createEmbed(o,e){let{html:t}=o;if(!t)return null;if(!e)throw new TypeError(\"An element must be provided\");",
  "createEmbed empty-html guard",
);

mustReplace(
  "return new Promise((r,n)=>{if(!isVimeoUrl(o))throw new TypeError(`“${o}” is not a vimeo.com url.`);",
  "return new Promise((r,n)=>{if(!isVimeoUrl(o)){r({html:\"\"});return}",
  "getOEmbedData invalid-url soft-fail",
);

mustReplace(
  "c.onload=function(){if(c.status===404){n(new Error(`“${o}” was not found.`));return}if(c.status===403){n(new Error(`“${o}” is not embeddable.`));return}try{const u=JSON.parse(c.responseText);if(u.domain_status_code===403){createEmbed(u,t),n(new Error(`“${o}” is not embeddable.`));return}r(u)}catch(u){n(u)}},c.onerror=function(){const u=c.status?` (${c.status})`:\"\";n(new Error(`There was an error fetching the embed code from Vimeo${u}.`))},c.send()})",
  "c.onload=function(){if(c.status===404||c.status===403){r({html:\"\"});return}try{const u=JSON.parse(c.responseText);if(u.domain_status_code===403){r({html:\"\"});return}r(u)}catch(u){r({html:\"\"})}},c.onerror=function(){r({html:\"\"})},c.send()})",
  "getOEmbedData network soft-fail",
);

// 12) Anti-flash: without #preloader the opaque WebGL buffer is visible as soon as
//     html.is-ready makes #canvas { display:block }. Defer is-ready until start() so
//     the light html/body background stays on screen during asset preload.
mustReplace(
  'settings.WEBGL_OFF||document.documentElement.classList.add("is-ready"),transitionOverlay.init()',
  "settings.WEBGL_OFF||0,transitionOverlay.init()",
  "delay is-ready until start",
);

mustReplace(
  "function start(){ui.start(),pagesManager.start(),app.start(),properties.hasStarted=!0,_onResize(!0)",
  'function start(){ui.start(),pagesManager.start(),app.start(),properties.hasStarted=!0,document.documentElement.classList.add("is-ready"),_onResize(!0)',
  "add is-ready on start",
);

// 13) bgColor must not start as black (new Color() default). HomePage only paints
//     off-white after hasInitialized; until then App.update clears with bgColor.
mustReplace(
  "properties.sharedUniforms.u_bgColor.value=properties.bgColor=new Color,shaderHelper",
  "properties.sharedUniforms.u_bgColor.value=properties.bgColor=new Color,properties.bgColor.setStyle(properties.offWhiteColorHex),shaderHelper",
  "bgColor light init",
);

// 14) Paint the drawing buffer light immediately (setClearColor alone does not draw).
//     Depends on apply-line-colors.mjs having inserted setClearColor(offWhite).
mustReplace(
  "properties.renderer.setClearColor(properties.offWhiteColorHex,1),properties.scene=new Scene",
  "properties.renderer.setClearColor(properties.offWhiteColorHex,1),properties.renderer.clear(),properties.scene=new Scene",
  "renderer clear light frame",
);

 // 15) Expose home-reel expand ratio for React BGM (scroll-driven u_showRatio).
 //     Emits window.__reelExpandRatio + CustomEvent("reel:expand-ratio").
 mustReplace(
   "this.videoPlaceholderRatio=w,this.showVideoPlaceholderButton=w>.9",
   'this.videoPlaceholderRatio=w,typeof window<"u"&&(window.__reelExpandRatio=w,window.dispatchEvent(new CustomEvent("reel:expand-ratio",{detail:{ratio:w}}))),this.showVideoPlaceholderButton=w>.9',
   "reel expand ratio bridge",
 );

// 16) FIX SCROLL: the engine's internal font loader points at "DaerdreeMono:400",
//     which is NOT shipped in /assets/fonts (only Aeonik/IBMPlexMono/LusionMono).
//     FontItem._loadFunc waits for the font's measured width to change; for a missing
//     @font-face it never changes → loader never reaches 100% → run()/start() never
//     fire → scrollManager.isActive stays false → native wheel is blocked forever.
//     Substitute the missing face with an existing one.
mustReplace(
  "Aeonik:500,Aeonik:400:italic,IBMPlexMono:400,IBMPlexMono:500,DaerdreeMono:400",
  "Aeonik:500,Aeonik:400:italic,IBMPlexMono:400,IBMPlexMono:500,Aeonik:400",
  "DaerdreeMono font → Aeonik",
);

// 17) FIX SCROLL: the tail of the engine binds a global passive:false wheel
//     preventDefault to kill native scrolling; the virtual ScrollManager only
//     takes over after start(). If anything stalls boot, the page is frozen.
//     Soften it: the engine's own Input listener still receives the wheel event,
//     native scroll is already impossible (#ui is fixed + body overflow hidden),
//     so the hard preventDefault is pure liability.
mustReplace(
  'window.addEventListener("wheel",o=>o.preventDefault(),{passive:!1});',
  'window.addEventListener("wheel",o=>{}, {passive:!1});',
  "wheel preventDefault softened",
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, raw);
console.log("wrote", outPath, `(${raw.length} bytes)`);
