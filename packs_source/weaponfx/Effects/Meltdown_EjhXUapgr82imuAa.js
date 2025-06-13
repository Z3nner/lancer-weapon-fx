const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });
const attachOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, ignoreElevation: true });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg",
    "modules/lancer-weapon-fx/soundfx/ReactorWarning.ogg",
    "modules/lancer-weapon-fx/advisories/Meltdown.svg",
    "jb2a.static_electricity.03",
    "jb2a.smoke.plumes.01.grey",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
    "jb2a.breath_weapons02.burst.line.fire.orange.01",
    "jb2a.moonbeam.01.loop",
]);

new Sequence()
    // rising shake
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 5000,
            fadeInDuration: 2000,
            fadeOutDuration: 1000,
            strength: 3,
            frequency: 25,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.2))
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/ReactorWarning.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 1000)
    .effect()
        .file("jb2a.moonbeam.01.loop")
        .attachTo(sourceToken, attachOffset)
        .tint("#f9a353")
        .scaleToObject(2.3)
        .fadeIn(2000)
        .fadeOut(1000)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .playbackRate(0.7)
        .opacity(0.4)
        .mask(sourceToken)
    .effect()
        .file("modules/lancer-weapon-fx/advisories/Meltdown.svg")
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner", offset: { y: 0.1 }, gridUnits: true })
        .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .duration(5000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })
        .waitUntilFinished(-2500)
    .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(1.5)
        .opacity(0.8)
        .repeats(3, 300)
        .delay(500)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .mask(sourceToken)
    .effect()
        .file("jb2a.smoke.plumes.01.grey")
        .atLocation(sourceToken, heightOffset)
        .opacity(0.34)
        .tint(0x33ddff)
        .filter("Glow", { color: 0x00a1e6 })
        .filter("Blur", { blur: 1 })
        .scaleToObject(2)
        .fadeIn(1500)
        .fadeOut(4700, { delay: -800 })
        .belowTokens()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
    // burst 1
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 500,
            fadeInDuration: 100,
            fadeOutDuration: 300,
            strength: 20,
            frequency: 25,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("jb2a.breath_weapons02.burst.line.fire.orange.01")
        .playbackRate(2.8)
        .filter("Glow", { distance: 10, color: 0x00b3ff, innerStrength: 10 })
        .opacity(0.5)
        .attachTo(sourceToken, attachOffset)
        .randomRotation()
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .scaleToObject()
        .repeats(2)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .belowTokens()
        .waitUntilFinished(-2000)
    // burst 2
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 500,
            fadeInDuration: 100,
            fadeOutDuration: 300,
            strength: 20,
            frequency: 25,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("jb2a.breath_weapons02.burst.line.fire.orange.01")
        .playbackRate(2.8)
        .filter("Glow", { distance: 3, color: 0x00b3ff, innerStrength: 4 })
        .opacity(0.5)
        .attachTo(sourceToken, attachOffset)
        .randomRotation()
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .scaleToObject(0.9)
        .repeats(2)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .belowTokens()
    .play();
