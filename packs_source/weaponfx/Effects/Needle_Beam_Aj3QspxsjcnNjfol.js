const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg",
    "jb2a.lasershot.green",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    let targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: true,
            randomOffset: 0.3,
            missed: targetsMissed.has(target.id),
        });

    sequence
        .canvasPan() // charge
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 700,
                fadeOutDuration: 100,
                fadeInDuration: 600,
                strength: 3,
                frequency: 20,
                rotation: false,
            }),
        )
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished(-1200)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(2, 225);
    for (let j = 0; j < 2; j++) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 200,
                    strength: 15,
                    frequency: 10,
                    rotation: false,
                }),
            )
            .delay(j * 225);
    }
    sequence
        .effect()
            .file("jb2a.lasershot.green")
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .aboveInterface()
            .xray()
            .repeats(2, 225)
            .waitUntilFinished(-350);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.impact.orange.0")
                .atLocation(target, targetHeightOffset)
                .rotateTowards(sourceToken)
                .rotate(230)
                .center()
                .aboveInterface()
                .xray()
                .tint("#1aff34")
                .scale(0.8);
    }
}
sequence.play();
