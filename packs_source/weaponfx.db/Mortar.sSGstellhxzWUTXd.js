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

const centerMass = findCenterOfTargetGroup(targetTokens);

const repeatImpactAnimationForEachTarget = function (sequence, targetTokens) {
    targetTokens.forEach(t => {
        if (!targetsMissed.has(t.id)) {
            sequence.effect()
                .file("jb2a.explosion_side.01.orange")
                .atLocation(t)
                .rotateTowards(centerMass)
                .scale(0.7)
                .center()
        }
    });
    return sequence;
}

let sequence = new Sequence();

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.smoke.puff.side.02.white")
        .atLocation(sourceToken)
        .rotateTowards(centerMass)
        .scale({y: 0.5});
	sequence.effect()
        .file("jb2a.bullet.02.orange")
        .atLocation(sourceToken)
        .stretchTo(centerMass)
	.playbackRate(0.7)
	.waitUntilFinished(-650)

    sequence.effect()
        .file("jb2a.explosion.shrapnel.bomb.01.black")
        .atLocation(centerMass)
        .scale(0.5);
    sequence.effect()
        .file("jb2a.explosion.08.orange")
        .atLocation(centerMass)
	.rotateTowards(sourceToken)
        .rotate(180)
        .center();
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
		
sequence = repeatImpactAnimationForEachTarget(sequence, targetTokens);

sequence.play();