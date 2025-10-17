const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "jb2a.impact.orange.0",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished();

    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.impact.orange.0")
            .atLocation(target, { randomOffset: 0.7 }, { gridUnits: true })
            .rotateTowards(sourceToken)
            .missed(targetsMissed.has(target.id))

        .rotate(230)
        .center();
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished(-2800);
}
sequence.play();
