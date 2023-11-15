const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const findCenterOfTargetGroup = function (targetTokens) {
    let total_x = 0;
    let total_y = 0;
    const numTargets = targetTokens.length;
    targetTokens.forEach(t => {
        let center = t.getCenter(t.position.x, t.position.y);
        total_x = total_x + center.x;
        total_y = total_y + center.y;
    });
    return {x: (total_x / numTargets), y: (total_y / numTargets)};
};

const target = findCenterOfTargetGroup(targetTokens);

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .waitUntilFinished()

    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

    .effect()
    .file("jb2a.bullet.01.orange")
    .atLocation(sourceToken)
    .stretchTo(target)
    .scale(2.0)
    .waitUntilFinished(-300);

    sequence.effect()
    .file("jb2a.fireball.explosion.orange")
    .atLocation(target)
    .zIndex(1)

    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    ;

sequence.play();