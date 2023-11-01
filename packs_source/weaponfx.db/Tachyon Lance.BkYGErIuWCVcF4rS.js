const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished();

    sequence.effect()
        .file("jb2a.impact.orange.0")
        .atLocation(target, {randomOffset: 0.7})
        .rotateTowards(sourceToken)
        .missed(targetsMissed.has(target.id))
        .repeats(3, 100)
        .rotate(230)
        .center();
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-400);
}
sequence.play();
