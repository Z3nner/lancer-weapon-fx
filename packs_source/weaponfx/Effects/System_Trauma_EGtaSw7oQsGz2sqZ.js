const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });
const heightOffsetRand = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, randomOffset: 0.3 });

await Sequencer.Preloader.preloadForClients([
    "jb2a.explosion_side.01.orange.1",
    "modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg",
    "jb2a.impact.005.orange",
    "jb2a.explosion.side_fracture.flask.01.0",
]);

let sequence = new Sequence()
    .effect()
        .file("jb2a.explosion_side.01.orange.1")
        .atLocation(sourceToken, heightOffsetRand)
        .randomSpriteRotation()
        .scaleToObject(1.4)
        .repeats(3, 125)
        .aboveInterface()
        .xray()
        .opacity(0.8)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
    .effect()
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, heightOffsetRand)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .scaleToObject(1.6)
        .belowTokens()
        .xray()
        .repeats(3, 125)
        .opacity(0.8)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 125);
// burst
for (let j = 0; j < 4; j++) {
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 125,
                fadeInDuration: 50,
                fadeOutDuration: 100,
                strength: 20,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(j * 125);
}
sequence
    .effect()
        .file("jb2a.explosion.side_fracture.flask.01.0")
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(1.4)
        .randomRotation()
        .delay(200)
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .belowTokens()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()

    .play();
