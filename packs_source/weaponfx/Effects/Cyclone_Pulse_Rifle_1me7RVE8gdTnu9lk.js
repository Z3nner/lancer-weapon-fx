const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg",
    "jb2a.magic_missile.purple",
    "modules/lancer-weapon-fx/soundfx/CPR_Impact.ogg",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: true,
            randomOffset: 0.5,
            missed: targetsMissed.has(target.id),
        });

    const random = Sequencer.Helpers.random_float_between(100, 125);
    const randomShots = Sequencer.Helpers.random_float_between(5, 7);

    // FIRE
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
            .repeats(randomShots, random);
    for (let j = 0; j < randomShots; j++) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: random,
                    fadeOutDuration: random / 2,
                    strength: 10,
                    frequency: 15,
                    rotation: false,
                }),
            )
            .delay(j * random);
    }
    sequence
        .effect()
            .file("jb2a.magic_missile.purple")
            .filter("ColorMatrix", { hue: 220 })
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .aboveInterface()
            .xray()
            .repeats(randomShots, random)
            .waitUntilFinished(-1600);
    // IMPACT
    if (!targetsMissed.has(target.id)) {
        for (let j = 0; j < randomShots; j++) {
            sequence
                .canvasPan()
                    .shake(
                    game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                        duration: 300,
                        fadeOutDuration: random,
                        strength: 15,
                        frequency: 25,
                        rotation: false,
                    }),
                )
                .delay(j * random);
        }
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/CPR_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
                .repeats(randomShots, random)
                .waitUntilFinished();
    }
}
sequence.play();
