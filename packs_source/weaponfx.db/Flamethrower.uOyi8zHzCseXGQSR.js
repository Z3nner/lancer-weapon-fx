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
    .effect()
        .file("jb2a.burning_hands.01.orange")
        .atLocation(sourceToken)
        .rotateTowards(target)
        .scale({x: 0.75, y: 1.0})
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-3000)
		
for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];		

    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.flames.02.orange")
            .opacity(0.7)
            .fadeIn(800)
            .fadeOut(800)
            .atLocation(target)
	    .scaleToObject(1.2);
    }
}
        sequence.play();