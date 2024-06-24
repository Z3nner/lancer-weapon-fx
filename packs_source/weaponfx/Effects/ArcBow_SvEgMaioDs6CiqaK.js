const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const findFarthestTargetOfGroup = function (targetTokens) {
    let farthestToken = null;
    let farthestTokenDistance = 0;
    targetTokens.forEach(t => {
        let distance = canvas.grid.measureDistance(sourceToken, t);
        if (distance > farthestTokenDistance) {
            farthestToken = t;
            farthestTokenDistance = distance;
        }
    });

    return farthestToken;
};

const farthest = findFarthestTargetOfGroup(targetTokens);

function findNearestTargetOfGroup(targetTokens) {
    let nearestToken = null;
    let nearestTokenDistance = Infinity;
    targetTokens.forEach(n => {
        let distance = canvas.grid.measureDistance(sourceToken, n);
        if (distance < nearestTokenDistance) {
            nearestToken = n;
            nearestTokenDistance = distance;
        }
    });
    return nearestToken;
}

const nearest = findNearestTargetOfGroup(targetTokens);

const repeatImpactAnimationForEachTarget = function (sequence, targets) {
    targets.forEach(t => {
        if (!targetsMissed.has(t.id)) {
            sequence
            .effect()
                .file("jb2a.chain_lightning.secondary.blue")
                .atLocation(farthest)
                .stretchTo(t, { randomOffset: 0.5 })
                .delay(800);
        }
    });
    return sequence;
};

await Sequencer.Preloader.preloadForClients([
    "jb2a.chain_lightning.secondary.blue",
    "modules/lancer-weapon-fx/soundfx/ArcBowFire.ogg",
    "modules/lancer-weapon-fx/soundfx/veil_rifle.ogg",
    "jb2a.arrow.physical.blue",
    "jb2a.chain_lightning.primary.blue",
]);

let sequence = new Sequence();

sequence
.sound()
    .file("modules/lancer-weapon-fx/soundfx/ArcBowFire.ogg")
    .delay(800)
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
.sound()
    .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
    .delay(1200)
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
.effect()
    .file("jb2a.arrow.physical.blue")
    .atLocation(sourceToken)
    .stretchTo(farthest)
    .waitUntilFinished(-1000)
.effect()
    .file("jb2a.chain_lightning.primary.blue")
    .atLocation(sourceToken)
    .stretchTo(farthest)
    .opacity(0.6)
    .scale(0.6);

sequence = repeatImpactAnimationForEachTarget(sequence, targetTokens);

sequence.play();
