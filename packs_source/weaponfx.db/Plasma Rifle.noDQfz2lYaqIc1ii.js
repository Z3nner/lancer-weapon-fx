const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.lasershot.green")
        .atLocation(sourceToken)
        .stretchTo(target, {randomOffset: 0.4})
        .missed(targetsMissed.has(target.id))
        .repeats(3, 300);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 300);
    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.impact.004.blue")
            .atLocation(target, {randomOffset: 0.4})
            .tint("#1aff34")
            .scale(0.6)
            .repeats(3, 300)
            .delay(400)
            .waitUntilFinished(-1800);
    }
}
sequence.play();
