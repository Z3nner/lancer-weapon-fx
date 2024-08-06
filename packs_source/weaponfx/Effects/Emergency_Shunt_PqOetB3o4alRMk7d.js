const {sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg",
    "modules/lancer-weapon-fx/soundfx/ReactorWarning.ogg",
    "modules/lancer-weapon-fx/advisories/EmergencyShunt.svg",
    "jb2a.smoke.plumes.01.grey",
    "modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg",
    "modules/lancer-weapon-fx/soundfx/EmergencyShunt.ogg",
    "jb2a.moonbeam.01.loop",
    "modules/JB2A_DnD5e/Library/Generic/Smoke/SmokePuffRing01_02_Regular_White_400x400.webm",
    "modules/JB2A_DnD5e/Library/Generic/Smoke/SmokePuffSide02_02_Regular_White_400x400.webm",
]);

new Sequence()

    .sound()
      .file("modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg")
      .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.2))
    .sound()
      .file("modules/lancer-weapon-fx/soundfx/ReactorWarning.ogg")
      .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
      .repeats(2, 1000)
    .effect()
      .file("jb2a.moonbeam.01.loop")
      .attachTo(sourceToken, { offset: { x: ipivotx, y: ipivoty } } )
      .tint("#f9a353")
      .scaleToObject(2.3)
      .fadeIn(2300)
      .fadeOut(1000)
      .playbackRate(0.7)
      .opacity (0.25)
      .mask(sourceToken)
    .effect()
      .file("modules/lancer-weapon-fx/advisories/EmergencyShunt.svg")
      .attachTo(sourceToken, {align: "bottom-left", edge: "inner", offset: { y: 0.1 }, gridUnits: true })
      .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
      .scaleIn(0.01, 500)
      .scale(0.09)
      .filter("Glow", { distance: 2, color: 0x000000 } )
      .aboveInterface()
      .duration(5000)
      .fadeIn(400)
      .fadeOut(800, { delay: -1200 } )
      .waitUntilFinished(-3200)
   .effect()
    .file("jb2a.smoke.plumes.01.grey")
    .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty}})
    .opacity(0.34)
    .tint(0x33ddff)
    .filter("Glow", { color: 0x00a1e6 })
    .filter("Blur", { blur: 1})
    .scaleToObject(2)
    .fadeIn(1500)
    .fadeOut(4700, {delay: -800})
    .rotate(-35)
    .belowTokens()
 .effect()
    .file("modules/JB2A_DnD5e/Library/Generic/Smoke/SmokePuffRing01_02_Regular_White_400x400.webm")
    .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty}})
    .opacity(0.6)
    .tint(0x33ddff)
    .filter("Glow", { color: 0x00a1e6 })
    .filter("Blur", { blur: 5})
    .scaleToObject(1.4)
    .belowTokens()
 .effect()
    .file("modules/JB2A_DnD5e/Library/Generic/Smoke/SmokePuffSide02_02_Regular_White_400x400.webm")
    .attachTo(sourceToken, {align: "right", edge: "on"})
    .opacity(0.6)
    .tint(0x33ddff)
    .filter("Glow", { color: 0x00a1e6 })
    .filter("Blur", { blur: 5})
    .scaleToObject(1.5)
    .delay(200)
    .belowTokens()
  .sound()
    .file("modules/lancer-weapon-fx/soundfx/EmergencyShunt.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .waitUntilFinished(-1800)
  .sound()
    .file("modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    
.play();