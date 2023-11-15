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

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    sequence.effect()
        .file("jb2a.breath_weapons02.burst.cone.fire.orange.02")
        .atLocation(sourceToken)
	.filter("ColorMatrix", {hue: 270})
        .filter("Glow", {distance: 3, color: 0xe99649, innerStrength: 2})
        .scale({x: 0.9})
        .playbackRate(1.6)
        .rotateTowards(target)
        .waitUntilFinished(-3500);
		
for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];		

    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.flames.02.orange")
	    .filter("ColorMatrix", {hue: 270})
            .filter("Glow", {distance: 3, color: 0xe99649, innerStrength: 2})
            .opacity(0.7)
            .fadeIn(800)
            .fadeOut(800)
            .atLocation(target)
	    .scaleToObject(1.2);
    }
}
    sequence.play();