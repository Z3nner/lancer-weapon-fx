const args = arguments[0].args;

const findCenterOfTargetGroup = function(targetTokens) {
    let total_x = 0;
    let total_y = 0;
    const numTargets = targetTokens.length;
    targetTokens.forEach(t => {
        let center = t.getCenter(t.position.x, t.position.y);
        total_x = total_x + center.x;
        total_y = total_y + center.y;
    });
    return {x: (total_x / numTargets), y: (total_y / numTargets)}
};

let source, target;
if (args && args.length == 2 && args[0] && args[1]) {
    // Arguments passed in from caller -- default to using these
    source = args[0];
    target = findCenterOfTargetGroup(args[1]);
} else {
    // No arguments passed -- make sensible guesses
    if (canvas.tokens.controlled.length > 0) {
        source = canvas.tokens.controlled[0];
    } else {
        // Handle sanity check gracefully
        ui.notifications.error("No source token selected, cannot play weapon FX");
        return;
    }

    const gameTargets = Array.from(game.user.targets);
    if (!gameTargets || gameTargets.length == 0) {
        // Handle sanity check gracefully
        ui.notifications.error("No targets selected, cannot play weapon FX");
        return;
    }
    target = findCenterOfTargetGroup(gameTargets);
}

let sequence = new Sequence()
    .effect()
        .file("jb2a.burning_hands.01.orange")
        .atLocation(source)
        .rotateTowards(target)
        .scale({ x: 0.9, y: 1.2 })
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(0.5)
    .play();