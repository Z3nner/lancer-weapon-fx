const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg",
    "jb2a.lasershot.green",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-1200)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(2, 225)

    .effect()
        .file("jb2a.lasershot.green")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .repeats(2, 225)
        .waitUntilFinished(-350);
    if (!targetsMissed.has(target.id)) {
        sequence
        .effect()
            .file("jb2a.impact.orange.0")
            .atLocation(target)
            .rotateTowards(sourceToken)
            .rotate(230)
            .center()
            .tint("#1aff34")
            .scale(0.8);
    }
}
sequence.play();
