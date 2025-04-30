const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const random = Sequencer.Helpers.random_float_between(200, 300);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Laser_Fire.ogg",
    "jb2a.impact.blue.2",
    "jb2a.lasershot.blue",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    let targetOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: true,
            randomOffset: 0.4,
            missed: targetsMissed.has(target.id),
        });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Laser_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .duration(633)
            .repeats(3, random);
    for (let j = 0; j < 3; j++) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: random,
                    fadeOutDuration: random,
                    strength: 7,
                    frequency: 20,
                    rotation: false,
                }),
            )
            .delay(j * random);
    }
    sequence
        .effect()
            .file("jb2a.lasershot.blue")
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetOffset)
            .missed(targetsMissed.has(target.id))
            .repeats(3, random)
            .xray()
            .aboveInterface()
            .waitUntilFinished();
}
sequence.play();
