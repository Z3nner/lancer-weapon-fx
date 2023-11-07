const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.bullet.Snipe.blue")
        .filter("ColorMatrix", {hue: 200})
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
        sequence.effect()
            .file("jb2a.impact.orange.0")
            .atLocation(target)
            .rotateTowards(sourceToken)
            .rotate(230)
            .center()
            .waitUntilFinished();
    }
}
sequence.play();
