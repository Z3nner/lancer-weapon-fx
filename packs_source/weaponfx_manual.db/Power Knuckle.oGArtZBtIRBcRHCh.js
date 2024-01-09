const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.unarmed_strike.physical.02.blue")
        .scale(0.9)
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/knuckleswing.ogg")
        .delay(300)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/knucklehit.ogg")
            .delay(600)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
            .waitUntilFinished(-100);
    }
}
sequence.play();