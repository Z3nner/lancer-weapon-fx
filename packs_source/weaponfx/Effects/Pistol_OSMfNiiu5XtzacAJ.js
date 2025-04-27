const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const random = Sequencer.Helpers.random_float_between(350, 450);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/pistol_fire.ogg",
    "jb2a.bullet.01.orange",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    let targetOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: true,
            randomOffset: 0.5,
            missed: targetsMissed.has(target.id),
        });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/pistol_fire.ogg")
            .repeats(3, random)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    for (let j = 0; j < 3; j++) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: random,
                    fadeOutDuration: random,
                    strength: 6,
                    frequency: 20,
                    rotation: false,
                }),
            )
            .delay(j * random);
    }
    sequence
        .effect()
            .file("jb2a.bullet.01.orange")
            .atLocation(sourceToken, heightOffset)
            .scale(0.5)
            .stretchTo(target, targetOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .aboveInterface()
            .repeats(3, random)
            .waitUntilFinished(-100);
}
sequence.play({ preload: true });
