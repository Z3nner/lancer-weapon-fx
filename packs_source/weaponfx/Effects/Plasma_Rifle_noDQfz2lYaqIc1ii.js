const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const tokenHeight = sourceToken.verticalHeight;

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg",
    "jb2a.impact.004.blue",
    "jb2a.lasershot.green",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const halfTargetTokenHeight = (targetTokens[0].verticalHeight / 2) * 0.6; // 60% of the height of the target token

    let targetOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: 0.3, missed: targetsMissed.has(target.id) });

    const randomDelay = Sequencer.Helpers.random_float_between(300, 400);
    let randomShots = Sequencer.Helpers.random_int_between(2, 4);

    for (let j = 0; j < randomShots; j++) {
        const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: true,
            missed: targetsMissed.has(target.id),
        });

        // SHOT
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 100,
                    fadeOutDuration: 100,
                    strength: 4,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .delay(200)
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
                .duration(633)
            .effect()
                .file("jb2a.lasershot.green")
                .atLocation(sourceToken, heightOffset)
                .stretchTo(target, targetHeightOffset)
                .scale(tokenHeight)
                .missed(targetsMissed.has(target.id))
                .waitUntilFinished(-700);
        // IMPACT
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 400,
                    fadeOutDuration: 300,
                    strength: 8,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .delay(300)
            .effect()
                .file("jb2a.impact.004.blue")
                .playIf(!targetsMissed.has(target.id))
                .atLocation(target, targetHeightOffset)
                .tint("#1aff34")
                .scale(tokenHeight / 1.5)
                .delay(300)
                .playbackRate(1.5);
        sequence.wait(randomDelay);
    }
    sequence.wait(300);
}
sequence.play();
