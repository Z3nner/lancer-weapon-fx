const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/RetortLoop.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
    sequence.effect()
        .file("jb2a.energy_beam.normal.bluepink.02")
        .scale(0.7)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .delay(200);
    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.impact.blue")
            .scale(0.3)
            .atLocation(target, {randomOffset: 0.9})
            .repeats(8, 300)
            .delay(500)
            .waitUntilFinished();
    }
}
sequence.play();
