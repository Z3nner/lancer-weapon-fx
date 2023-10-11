const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/AutoPod_Fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .effect()
    .file("jb2a.lightning_ball.blue")
    .endTime(1500)
    .scale(0.2)
    .atLocation(sourceToken)
    .moveTowards(target)
    .missed(targetsMissed.has(target.id))
    .waitUntilFinished();

if (!targetsMissed.has(target.id)) {
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/AirBurst.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .effect()
        .file("jb2a.explosion.02.blue")
        .scale(0.5)
        .atLocation(target)
        .waitUntilFinished();
}

sequence.play();
