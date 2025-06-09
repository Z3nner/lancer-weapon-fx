const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "jb2a.eldritch_blast.purple",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
    "jb2a.impact.004.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: true, missed: targetsMissed.has(target.id) });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .effect()
            .file("jb2a.eldritch_blast.purple")
            .startTime(900)
            .scale(0.86)
            .atLocation(sourceToken, heightOffset)
            .xray()
            .aboveInterface()
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .waitUntilFinished(-3100);
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 700,
                    fadeOutDuration: 500,
                    strength: 8,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .delay(100);
        sequence
            .effect()
                .file("jb2a.impact.004.blue")
                .filter("ColorMatrix", { hue: 50 })
                .scale(1.0)
                .atLocation(target, targetHeightOffset)
                .xray()
                .aboveInterface()
                .randomSpriteRotation()
                .waitUntilFinished(-400);
    } else {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    }
}
sequence.play();
