const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

//Calculate the point at the center of a group of targets
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

const pTarget = findCenterOfTargetGroup(targetTokens);

// Calculate the point 70% of the distance between sourceToken and pTarget
const pBlast = {
    x: sourceToken.position.x + 0.6 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.6 * (pTarget.y - sourceToken.position.y),
};


let sequence = new Sequence()


    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000);
    sequence.effect()
        .file("jb2a.throwable.launch.missile")
        .scale(0.7)
        .from(sourceToken)
        .stretchTo(pBlast)
        .waitUntilFinished(-200)
    .effect()
         .file("jb2a.explosion.08")
         .atLocation(pBlast)
         .name("impact")
         .scale(0.8)
         .zIndex(1)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];		

    sequence.effect()
        .file("jb2a.bullet.02.orange")
	.playIf(!targetsMissed.has(target.id))
         .scale(0.5)
	 .atLocation(pBlast)
	 .stretchTo(target)
    .effect()
        .file("jb2a.explosion_side.01")
	.playIf(!targetsMissed.has(target.id))
        .atLocation(target)
	.rotateTowards(pBlast)
	.center()
        .delay(350)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
	.delay(350);
}
sequence.play();