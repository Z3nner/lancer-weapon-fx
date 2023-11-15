const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.disintegrate.green")
        .startTime(900)
        .scale(.86)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-4000)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));;
    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.impact.blue.3")
            .scaleToObject(2)
            .atLocation(target)
            .waitUntilFinished(-400);
    }
}
sequence.play();