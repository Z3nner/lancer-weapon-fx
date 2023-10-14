const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];
let scale = 0.1 * target.actor.system.derived.mm.Size;

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
    .effect()
    .file("jb2a.energy_strands.complete.blue.01")
    .tint("#ceb673")
    .endTime(1500)
    .scale(0.10)
    .atLocation(sourceToken)
    .moveTowards(target)
    .missed(targetsMissed.has(target.id))
    .waitUntilFinished(200);

if (!targetsMissed.has(target.id)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .repeats(3, 100)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6));
    sequence.effect()
        .file("jb2a.impact.blue")
        .tint("#ceb673")
        .scale(0.3)
        .atLocation(target, {randomOffset: 0.9})
        .repeats(3, 100)
}

sequence.play();
