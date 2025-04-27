const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "jb2a.impact.orange.0",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    let targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.7, missed: targetsMissed.has(target.id) });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished();

    sequence
        .effect()
            .file("jb2a.impact.orange.0")
            .atLocation(target, targetHeightOffsetRand)
            .xray()
            .aboveInterface()
        //.rotateTowards(sourceToken)
        .missed(targetsMissed.has(target.id))
        .isometric({ overlay: true })
        //.rotate(230)
        .center();
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished(-2800);
}
sequence.play();
