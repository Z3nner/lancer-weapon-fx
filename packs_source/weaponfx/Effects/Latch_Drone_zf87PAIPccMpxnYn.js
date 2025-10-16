const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/sprites/LatchDrone.png",
    "modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg",
    "modules/lancer-weapon-fx/soundfx/Stabilize.ogg",
    "jb2a.healing_generic.400px.green",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });
    const moveTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });

    const rotateTowardsOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });
    rotateTowardsOffset.rotationOffset = 90;

    sequence // launch
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 300,
                fadeOutDuration: 50,
                fadeInDuration: 200,
                strength: 5,
                frequency: 15,
                rotation: false,
            }),
        );
    sequence
        .effect()
            .file("modules/lancer-weapon-fx/sprites/LatchDrone.png")
            .spriteRotation(120)
            .atLocation(sourceToken, heightOffset)
            .moveTowards(moveTowardsOffset, { ease: "easeOutSine" })
            .xray()
            .aboveInterface()
            .missed(targetsMissed.has(target.id))
            .moveSpeed(500);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished(-200);
    if (!targetsMissed.has(target.id)) {
        sequence // impact/stabilize
            .canvasPan()
                .shake({
                duration: 250,
                fadeInDuration: 100,
                //fadeOutDuration: 100,
                strength: 6, // increase strength with each iteration.
                frequency: 15,
                rotation: false,
            })
            .canvasPan()
                .shake({
                duration: 1500,
                fadeInDuration: 200,
                fadeOutDuration: 1300,
                strength: 4, // increase strength with each iteration.
                frequency: 2,
                rotation: false,
            })
            .delay(200);
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9))
                .delay(200)
            .effect()
                .file("jb2a.healing_generic.400px.green")
                .atLocation(target, targetHeightOffset)
                .scaleToObject(2.1)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .delay(200)
                .xray()
                .aboveInterface()
                .waitUntilFinished();
    }
}
sequence.play();
