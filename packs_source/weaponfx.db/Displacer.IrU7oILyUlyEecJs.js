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

let sequence = new Sequence()

    .sound()
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
        .startTime(900)
        .fadeInAudio(300)
		
    .effect()
        .file("jb2a.dancing_light.purplegreen")
        .tint("#2d0a3d")
        .filter("Glow", {strength: 1, color: 0x34e5d0})
        .endTime(3000)
        .scale(0.40)
        .atLocation(sourceToken)
        .moveTowards(pTarget)
        .waitUntilFinished();
		
   sequence.effect()
        .file("jb2a.fumes.steam.white")
        .fadeIn(1500)
        .fadeOut(1500)
        .atLocation(sourceToken)
        .spriteAnchor({ x: 0.2, y: 1.2 })
        .scaleToObject()
        .opacity(0.7);
		
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
    sequence.effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .tint("#2d0a3d")
        .filter("Glow", {strength: 1, color: 0x34e5d0})
        .scale(.9)
        .atLocation(pTarget)
        .waitUntilFinished(-1500);



for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];		

    if (!targetsMissed.has(target.id)) {


    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit1.ogg")
        .repeats(6, 200)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6));
    sequence.effect()
        .file("jb2a.impact.blue")
        .tint("#2d0a3d")
	.filter("Glow", {strength: 2, color: 0x34e5d0})
        .scaleToObject(2)
        .atLocation(target, {randomOffset: 0.9})
        .repeats(6, 200);
    }
}

sequence.play();