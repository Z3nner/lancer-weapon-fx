const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });
const rotateTowardsOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, useAbsoluteCoords: true });

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

const target = findFarthestTargetOfGroup(targetTokens);

const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });

const repeatImpactAnimationForEachTarget = async function (sequence, targets) {
    for (const t of targets) {
        if (!targetsMissed.has(t.id)) {
            const targetHeightOffset = game.modules
                .get("lancer-weapon-fx")
                .api.getTokenHeightOffset({ targetToken: t, missed: targetsMissed.has(t.id) });

            sequence
                .effect()
                    .file("jb2a.impact.orange.0")
                    .atLocation(t, targetHeightOffset)
                    .rotate(230)
                    .rotateTowards(rotateTowardsOffset)
                    .center();
        }
    }
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

    .canvasPan() // charge
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 800,
            fadeOutDuration: 100,
            fadeInDuration: 600,
            strength: 3,
            frequency: 10,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-500);

sequence
    .effect() // bullet
        .file("jb2a.bullet.Snipe.blue")
        .atLocation(sourceToken, heightOffset)
        .stretchTo(target, targetHeightOffset)
        .xray()
        .aboveInterface()
    .canvasPan() // bang shake
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 100,
            strength: 25,
            frequency: 10,
            rotation: false,
        }),
    )
    .canvasPan() // bang trail off shake
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 500,
            fadeOutDuration: 450,
            strength: 6,
            frequency: 15,
            rotation: false,
        }),
    )
    .delay(200)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

sequence = await repeatImpactAnimationForEachTarget(sequence, targetTokens);

sequence.play();
