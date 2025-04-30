const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.divine_smite.target.blueyellow",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.extras.tmfx.outpulse.circle.01.normal",
    "jb2a.impact.001.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const moveTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });
    const targetHeightOffsetRandSeven = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.7 });
    const targetHeightOffsetRandNine = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.9 });

    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 150,
                fadeInDuration: 250,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(500);
    sequence
        .effect()
            .file("jb2a.divine_smite.target.blueyellow")
            .scale(0.9)
            .tint("#8c0353")
            .atLocation(sourceToken, heightOffset)
            .moveTowards(moveTowardsOffset)
            .moveSpeed(175)
            .spriteOffset({ x: 0, y: 100, gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .rotate(90)
            .delay(500)
            .xray()
            .aboveInterface()
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .delay(500)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
                .delay(800)
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        for (let j = 0; j < 6; j++) {
            sequence
                .canvasPan()
                    .shake({
                    duration: 120,
                    fadeInDuration: 20,
                    fadeOutDuration: 70,
                    strength: 7 + j * 3, // increase strength with each iteration.
                    frequency: 25 - j * 2,
                    rotation: false,
                })
                .delay(1200 + j * 120);
        }
        sequence
            .effect()
                .file("jb2a.extras.tmfx.outpulse.circle.01.normal")
                .atLocation(target, targetHeightOffsetRandSeven)
                .scaleToObject(1.2)
                .tint("#8c0353")
                .filter("Glow", { color: 0x8a0303, distance: 1 })
                .repeats(3, 200)
                .playbackRate(2)
                .belowTokens()
                .delay(800)
                .xray()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .aboveInterface();

        sequence
            .effect()
                .file("jb2a.impact.001.blue")
                .scaleToObject(1.2)
                .tint("#8c0353")
                .filter("Glow", { color: 0x8a0303, distance: 1 })
                .atLocation(target, targetHeightOffsetRandNine)
                .repeats(6, 120)
                .delay(1200)
                .xray()
                .aboveInterface()
                .randomSpriteRotation()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .waitUntilFinished(-1500);
    }
}
sequence.play();
