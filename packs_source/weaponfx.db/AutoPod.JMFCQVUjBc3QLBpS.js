const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/AutoPod_Fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .effect()
    .file("jb2a.template_circle.vortex.loop.blue")
    .endTime(4700)
    .scale(0.20)
    .tint("#787878")
    .atLocation(sourceToken)
    .moveTowards(target)
    .missed(targetsMissed.has(target.id))
    .waitUntilFinished()

if (!targetsMissed.has(target.id)) {
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .effect()
        .file("jb2a.impact.yellow.1")
        .scale(.6)
        .atLocation(target)
}

sequence.play();
