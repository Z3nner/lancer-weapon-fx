const {sourceToken, targetTokens} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

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
    .scale({x: 0.9, y: 1.2})
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .play();
