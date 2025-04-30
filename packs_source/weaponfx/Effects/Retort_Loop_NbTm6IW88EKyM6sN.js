const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const impacts = [
    "jb2a.impact.002.blue",
    "jb2a.impact.003.blue",
    "jb2a.impact.004.blue",
    //"jb2a.impact.007.blue",
    "jb2a.impact.011.blue",
];

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/RetortLoop.ogg",
    "jb2a.energy_beam.normal.bluepink.02",
    "jb2a.energy_attack.01.blue",
    "jb2a.impact.002.blue",
    "jb2a.impact.003.blue",
    "jb2a.impact.004.blue",
    //"jb2a.impact.007.blue",
    "jb2a.impact.011.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const targetHeightOffsetRandNine = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.9, missed: targetsMissed.has(target.id) });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/RetortLoop.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
    sequence
        .effect()
            .file("jb2a.energy_beam.normal.bluepink.02")
            .scale(0.7)
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .name("impact")
            .xray()
            .aboveInterface()
            .delay(200);
    sequence
        .canvasPan() // rising weak high speed shake for background
            .shake({
            duration: 3500,
            fadeInDuration: 3000,
            fadeOutDuration: 500,
            strength: 5,
            frequency: 1,
            rotation: false,
        })
        .delay(200); // line up to start of beam
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.divine_smite.caster.reversed.blueyellow")
                .filter("ColorMatrix", { hue: 220 })
                .scale(0.3)
                .atLocation(target, targetHeightOffset)
                .xray()
                .aboveLighting()
                .fadeIn(200)
                .playbackRate(0.8)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .delay(400);
        for (let j = 0; j < 8; j++) {
            sequence
                .canvasPan()
                    .shake({
                    duration: 200,
                    fadeInDuration: 50,
                    fadeOutDuration: 100,
                    strength: 5 + j, // increase strength with each iteration.
                    frequency: 25 - j * 2,
                    rotation: false,
                })
                .delay(700 + j * 200);
        }
        sequence
            .effect()
                .file(impacts)
                .scale(0.3)
                .atLocation(target, targetHeightOffsetRandNine)
                .repeats(8, 200)
                .xray()
                .aboveInterface()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .delay(700);
    } else {
        sequence
            .effect()
                .file(impacts)
                .scale(0.3)
                .atLocation("impact", targetHeightOffsetRandNine)
                .xray()
                .aboveInterface()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .repeats(8, 200)
                .delay(700);
    }
}
sequence.play();
