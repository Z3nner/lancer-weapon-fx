const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/advisories/DirectHit.svg",
    "jb2a.static_electricity.03.blue",
    "jb2a.explosion_side.01.orange.1",
    "modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg",
    "jb2a.impact.005.orange",
]);

new Sequence()

    .effect()
        .file("modules/lancer-weapon-fx/advisories/DirectHit.svg")
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner" })
        .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .duration(5000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })
    .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(sourceToken)
        .scaleToObject(1.1)
        .repeats(2, 2600)
        .mask(sourceToken)
    .effect()
        .file("jb2a.explosion_side.01.orange.1")
        .atLocation(sourceToken, { randomOffset: 0.5, gridUnits: true })
        .randomSpriteRotation()
        .scaleToObject(1.4)
        .repeats(3, 825)
        .delay(900)
        .opacity(0.8)
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, { randomOffset: 0.5, gridUnits: true })
        .randomSpriteRotation()
        .scaleToObject(1.4)
        .belowTokens()
        .repeats(3, 825)
        .delay(900)
        .opacity(0.8)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 825)
        .delay(900)
    .effect()
        .file("jb2a.explosion_side.01.orange.1")
        .atLocation(sourceToken, { randomOffset: 0.5, gridUnits: true })
        .randomSpriteRotation()
        .scaleToObject()
        .repeats(2, 325)
        .delay(2400)
        .opacity(0.8)
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, { randomOffset: 0.5, gridUnits: true })
        .randomSpriteRotation()
        .scaleToObject(1.5)
        .belowTokens()
        .repeats(2, 325)
        .delay(2400)
        .opacity(0.9)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(2, 325)
        .delay(2400)
        .waitUntilFinished(-500)

    .play();
