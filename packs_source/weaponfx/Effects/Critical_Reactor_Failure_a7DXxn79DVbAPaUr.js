const {sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg",
    "modules/lancer-weapon-fx/soundfx/ReactorWarning.ogg",
    "modules/lancer-weapon-fx/advisories/CriticalReactorFailure.svg",
    "jb2a.static_electricity.03",
    "jb2a.smoke.plumes.01.grey",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
    "modules/JB2A_DnD5e/Library/Generic/Template/Line/Breath_Weapon/Breathweapon02_Fire01_Regular_Orange_Line_Burst_1200x400.webm",
    "jb2a.moonbeam.01.loop",
    ]);

new Sequence()

    .sound()
      .file("modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg")
      .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.2))
    .sound()
      .file("modules/lancer-weapon-fx/soundfx/ReactorWarning.ogg")
      .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
      .repeats(3, 1000)
    .effect()
      .file("jb2a.moonbeam.01.loop")
      .attachTo(sourceToken, { offset: { x: ipivotx, y: ipivoty } } )
      .tint("#f9a353")
      .scaleToObject(2.4)
      .fadeIn(1700)
      .fadeOut(1000)
      .playbackRate(0.7)
      .opacity (0.5)
      .mask(sourceToken)
    .effect()
      .file("modules/lancer-weapon-fx/advisories/CriticalReactorFailure.svg")
      .attachTo(sourceToken, {align: "bottom-left", edge: "inner", offset: { y: 0.1 }, gridUnits: true })
      .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
      .scaleIn(0.01, 500)
      .scale(0.09)
      .filter("Glow", { distance: 2, color: 0x000000 } )
      .aboveInterface()
      .duration(5000)
      .fadeIn(400)
      .fadeOut(800, { delay: -1200 } )
      .waitUntilFinished(-2500)
    .effect()
      .file("jb2a.static_electricity.03")
      .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty}})
      .scaleToObject(1)
      .opacity(0.8)
      .repeats(3, 300)
      .delay(500)
      .mask(sourceToken)
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
    .sound()
      .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
      .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect() 
      .file("modules/JB2A_DnD5e/Library/Generic/Template/Line/Breath_Weapon/Breathweapon02_Fire01_Regular_Orange_Line_Burst_1200x400.webm")
      .playbackRate(2.8)
      .filter("Glow", { distance: 10, color: 0x00b3ff, innerStrength: 10 })
      .opacity(0.5)
      .attachTo(sourceToken, { offset: { x: ipivotx, y: ipivoty } } )
      .randomRotation()
      .spriteOffset({ x: 0.5 }, { gridUnits: true })
      .scaleToObject()
      .repeats(2)
      .belowTokens()
      .waitUntilFinished(-2000)
    .sound()
      .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
      .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
      .file("modules/JB2A_DnD5e/Library/Generic/Template/Line/Breath_Weapon/Breathweapon02_Fire01_Regular_Orange_Line_Burst_1200x400.webm")
      .playbackRate(2.8)
      .filter("Glow", { distance: 3, color: 0x00b3ff, innerStrength: 4 })
      .opacity(0.5)
      .attachTo(sourceToken, { offset: { x: ipivotx, y: ipivoty } } )
      .randomRotation()
      .spriteOffset({ x: 0.5 }, { gridUnits: true })
      .scaleToObject(0.9)
      .repeats(2)
      .belowTokens()


    
.play();