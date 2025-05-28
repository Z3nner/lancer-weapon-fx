const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_generic.slash.01.orange",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg",
    "jb2a.explosion.01.orange",
    "jb2a.static_electricity.03.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const targetHeightOffsetRand05 = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.5, missed: targetsMissed.has(target.id) });
    const targetHeightOffsetRand1 = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 1, missed: targetsMissed.has(target.id) });

    const rotateTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            missed: targetsMissed.has(target.id),
            useAbsoluteCoords: true,
        });

    sequence
        .effect()
            .file("jb2a.melee_generic.slash.01.orange")
            .scaleToObject(4)
            .atLocation(sourceToken, heightOffset)
            .spriteOffset({ x: -1.5 }, { gridUnits: true })
            .rotateTowards(rotateTowardsOffset)
            .delay(500)
            .missed(targetsMissed.has(target.id))
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 300,
                fadeInDuration: 300,
                strength: 4,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(500)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .delay(500)
            .waitUntilFinished(-1300);
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .effect()
                .file("jb2a.explosion.01.orange")
                .scale(1)
                .zIndex(2)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .aboveInterface()
                .xray()
                .randomSpriteRotation()
                .atLocation(target, targetHeightOffsetRand05)
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 1500,
                    fadeInDuration: 100,
                    fadeOutDuration: 1000,
                    strength: 10,
                    frequency: 25,
                    rotation: false,
                }),
            );
        sequence
            .effect()
                .file("jb2a.static_electricity.03.blue")
                .scale(0.4)
                .atLocation(target, targetHeightOffsetRand1)
                .repeats(2, 80)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .aboveInterface()
                .xray()
                .randomSpriteRotation()
                .waitUntilFinished(-800);
    }
}
sequence.play();
