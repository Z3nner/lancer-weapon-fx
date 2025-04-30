const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });
const heightOffsetRand = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, randomOffset: 0.5 });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/advisories/DirectHit.svg",
    "jb2a.static_electricity.03.blue",
    "jb2a.explosion_side.01.orange.1",
    "modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg",
    "jb2a.impact.005.orange",
]);

let sequence = new Sequence()

    .effect()
        .file("modules/lancer-weapon-fx/advisories/DirectHit.svg")
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner" })
        .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .aboveInterface()
        .xray()
        .duration(5000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })
    .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(sourceToken, heightOffset)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .scaleToObject(1.1)
        .repeats(2, 2600)
        .mask(sourceToken)
        .aboveInterface()
        .xray()
    .effect()
        .file("jb2a.explosion_side.01.orange.1")
        .atLocation(sourceToken, heightOffsetRand)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .scaleToObject(1.4)
        .repeats(3, 825)
        .delay(900)
        .opacity(0.8)
        .aboveInterface()
        .xray();
for (let j = 0; j < 3; j++) {
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 125,
                fadeInDuration: 50,
                fadeOutDuration: 100,
                strength: 15,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(900 + j * 825);
}
sequence
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, heightOffsetRand)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .scaleToObject(1.4)
        .belowTokens()
        .repeats(3, 825)
        .delay(900)
        .opacity(0.8)
        .xray()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 825)
        .delay(900);
for (let j = 0; j < 2; j++) {
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 175 + j * 25,
                fadeInDuration: 50,
                fadeOutDuration: 100,
                strength: 20 + j * 2,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(2400 + j * 325);
}
sequence
    .effect()
        .file("jb2a.explosion_side.01.orange.1")
        .atLocation(sourceToken, heightOffsetRand)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .scaleToObject()
        .repeats(2, 325)
        .delay(2400)
        .opacity(0.8)
        .aboveInterface()
        .xray()
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, heightOffsetRand)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .scaleToObject(1.5)
        .belowTokens()
        .repeats(2, 325)
        .delay(2400)
        .opacity(0.9)
        .xray()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(2, 325)
        .delay(2400)
        .waitUntilFinished(-500)

    .play();
