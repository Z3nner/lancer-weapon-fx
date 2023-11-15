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
    x: sourceToken.position.x + 0.7 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.7 * (pTarget.y - sourceToken.position.y),
};


let sequence = new Sequence()

	.sound()
        .file("modules/lancer-weapon-fx/soundfx/NexusReady.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished();
	sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/NexusFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 150);
    sequence.effect()
        .file("jb2a.bullet.01.orange")
        .filter("ColorMatrix", {hue: 070})
        .filter("Blur", {blur: 8, strength: 10, blurX: 4})
        .atLocation(sourceToken)
        .stretchTo(pBlast, {randomOffset: 0.6})
        .repeats(3, 150)
        .waitUntilFinished(-800);
    sequence.effect()
        .file("jb2a.side_impact.part.smoke.blue")
        .filter("ColorMatrix", {hue: 230, brightness: 0.5})
        .scale(0.8)
        .atLocation(pBlast, {randomOffset: 0.1})
	.rotateTowards(pTarget)
        .repeats(3, 150)
        .waitUntilFinished(-2200);

for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];		

    sequence.effect()
        .file("jb2a.impact.004.blue")
       .playIf(!targetsMissed.has(target.id))
        .filter("ColorMatrix", {hue: 235, brightness: 0.5})
        .scale(0.5)
	.zIndex(1)
        .atLocation(target, {randomOffset: 0.5, gridUnits: true})
        .repeats(3, 100);
    sequence.effect()
        .file("jb2a.zoning.inward.circle.loop")
	.playIf(!targetsMissed.has(target.id))
        .scale(0.4)
        .fadeOut(3800, {ease: "easeOutBack"})
        .belowTokens()
        .atLocation(target);
    sequence.sound()
	.file("modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .playIf(!targetsMissed.has(target.id));
}
sequence.play();