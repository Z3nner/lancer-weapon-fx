const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
    .file("jb2a.bullet.Snipe.blue")
    .tint("#9d9595")
    .atLocation(sourceToken)
    .stretchTo(target)
    .missed(targetsMissed.has(target.id))
    .waitUntilFinished(-1200)
if (!targetsMissed.has(target.id)) {
    sequence
        .effect()
        .file("jb2a.impact.orange.0")
        .atLocation(target)
        .rotateTowards(sourceToken)
        .rotate(230)
        .center()
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
}

sequence.play();