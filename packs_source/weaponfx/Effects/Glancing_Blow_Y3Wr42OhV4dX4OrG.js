const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const tokenHeight = sourceToken.verticalHeight;

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, sprayOffset: true });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/advisories/GlancingBlow.svg",
    "modules/lancer-weapon-fx/soundfx/ricochet.ogg",
    "jb2a.impact.005.orange",
]);

new Sequence()
    .effect()
        .file("modules/lancer-weapon-fx/advisories/GlancingBlow.svg")
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner" })
        .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .duration(5000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })
        .waitUntilFinished(-4500)
    // burst
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeInDuration: 50,
            fadeOutDuration: 100,
            strength: 20,
            frequency: 25,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/ricochet.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.4))
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, heightOffset)
        .rotate(90)
        .scaleToObject(1.6)
        .rotate(45)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .opacity(0.8)
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, heightOffset)
        .rotate(270)
        .scaleToObject(1.6)
        .rotate(45)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .belowTokens()
        .opacity(0.8)
    .play();
