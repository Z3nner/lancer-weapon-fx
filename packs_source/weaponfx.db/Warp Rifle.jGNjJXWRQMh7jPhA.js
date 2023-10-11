const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];
let scale = 0.1 * target.actor.system.derived.mm.Size;

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1.0))
    .startTime(900)
    .fadeInAudio(500)
    .effect()
    .file("jb2a.energy_strands.range.multiple.purple.01")
    .scale(0.40)
    .atLocation(sourceToken)
    .stretchTo(target)
    .missed(targetsMissed.has(target.id))
    .waitUntilFinished(-1100)

if (!targetsMissed.has(target.id)) {
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .delay(300)
        .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1.0))
        .scale(.9)
        .tint("#9523e1")
        .atLocation(target)
        .waitUntilFinished(-1000)
}

sequence.play();
