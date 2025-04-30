const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "jb2a.disintegrate.green",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
    "jb2a.impact.blue.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    let targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: true, missed: targetsMissed.has(target.id) });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
    sequence
        .effect()
            .file("jb2a.disintegrate.green")
            .startTime(900)
            .scale(0.86)
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .aboveInterface()
            .xray()
            .waitUntilFinished(-4000);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
    if (!targetsMissed.has(target.id)) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 400,
                    fadeOutDuration: 200,
                    strength: 10,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .delay(100);
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 2000,
                    fadeOutDuration: 2000,
                    strength: 4,
                    frequency: 60,
                    rotation: false,
                }),
            )
            .delay(300);
        sequence
            .effect()
                .file("jb2a.impact.blue.3")
                .scaleToObject(2)
                .atLocation(target, targetHeightOffset)
                .aboveInterface()
                .xray()
                .randomSpriteRotation()
                .waitUntilFinished(-400);
    }
}
sequence.play();
