const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];
let scale = 0.1 * target.actor.data.data.derived.mm.Size;
let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

let sequence = new Sequence()

    .sound()
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
    .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
    .startTime(900)
    .fadeInAudio(500)
    .effect()
    .file("jb2a.dancing_light.purplegreen")
    .tint("#2d0a3d")
    .endTime(3000)
    .scale(0.40)
    .atLocation(sourceToken)
    .moveTowards(target)
    .missed(targetsMissed.has(target.id))
    .waitUntilFinished(200);
sequence.effect()
    .file("jb2a.fumes.steam.white")
    .atLocation(sourceToken, {offset: {x: (50 * gridscale), y: (-50 * gridscale)}})
    .scale(scale)
    .scaleOut(3, 6000)
    .opacity(0.8);

if (!targetsMissed.has(target.id)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit1.ogg")
        .repeats(6, 200)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6));
    sequence.effect()
        .file("jb2a.impact.blue")
        .tint("#2d0a3d")
        .scale(0.3)
        .atLocation(target, {randomOffset: 0.9})
        .repeats(6, 200)
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .delay(600)
        .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .tint("#2d0a3d")
        .delay(300)
        .scale(.9)
        .atLocation(target)
        .waitUntilFinished(-1000)
}

sequence.play();
