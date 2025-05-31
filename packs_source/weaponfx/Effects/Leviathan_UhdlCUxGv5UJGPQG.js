const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Leviathan.ogg",
    "jb2a.bullet.01.orange",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    let targetOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: 0.3,
            randomOffset: 0.6,
            missed: targetsMissed.has(target.id),
        });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Leviathan.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .delay(500)
            .waitUntilFinished(-2100);
    for (let j = 0; j < 10; j++) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 20,
                    strength: 100,
                    frequency: 5,
                    rotation: false,
                }),
            )
            .delay(j * 30);
    }
    sequence
        .effect()
            .file("jb2a.bullet.01.orange")
            .atLocation(sourceToken, heightOffset)
            .missed(targetsMissed.has(target.id))
            .stretchTo(target, targetOffset)
            .repeats(8, 30)
            .scale(0.5)
            .waitUntilFinished(-500);
    for (let j = 0; j < 10; j++) {
        sequence
            .canvasPan()
                .playIf(!targetsMissed.has(target.id))
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 20,
                    fadeOutDuration: 20,
                    strength: 10 - j / 2, // impacts fade out over each iteration. helps it look less abrupt when it stops
                    frequency: 10,
                    rotation: false,
                }),
            )
            .delay(j * 30);
    }
}

sequence.play();
