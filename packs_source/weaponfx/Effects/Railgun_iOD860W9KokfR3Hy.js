const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const findFarthestTargetOfGroup = function (targetTokens) {
    let farthestToken = null;
    let farthestTokenDistance = 0;
    targetTokens.forEach(t => {
        let distance = canvas.grid.measurePath([sourceToken, t]).distance;
        if (distance > farthestTokenDistance) {
            farthestToken = t;
            farthestTokenDistance = distance;
        }
    });

    return farthestToken;
};

const target = findFarthestTargetOfGroup(targetTokens);

const repeatImpactAnimationForEachTarget = function (sequence, targets) {
    targets.forEach(t => {
        if (!targetsMissed.has(t.id)) {
            sequence
                .effect()
                    .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
                    .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
                    .file("jb2a.impact.orange.0")
                    .atLocation(t)
                    .rotateTowards(sourceToken)
                    .rotate(230)
                    .center();
        }
    });
    return sequence;
};

await Sequencer.Preloader.preloadForClients([
    "jb2a.impact.orange.0",
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "jb2a.bullet.Snipe.blue",
    "modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg",
    "modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-500);

sequence
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.bullet.Snipe.blue")
        .atLocation(sourceToken)
        .stretchTo(target)

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

sequence = repeatImpactAnimationForEachTarget(sequence, targetTokens);

sequence.play();
