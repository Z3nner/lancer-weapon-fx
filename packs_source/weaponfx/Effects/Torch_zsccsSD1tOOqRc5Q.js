const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.greataxe.melee.standard.white",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg",
    "jb2a.impact.blue.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
        .file("jb2a.greataxe.melee.standard.white")
        .tint("#c91af9")
        .scale(0.8)
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-1200)
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg")
        .playIf(!targetsMissed.has(target.id))
        .delay(275)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
        .effect()
        .file("jb2a.impact.blue.3")
        .playIf(!targetsMissed.has(target.id))
        .delay(275)
        .scaleToObject(2)
        .tint("#c91af9")
        .atLocation(target)
        .waitUntilFinished(-1000);
}
sequence.play();
