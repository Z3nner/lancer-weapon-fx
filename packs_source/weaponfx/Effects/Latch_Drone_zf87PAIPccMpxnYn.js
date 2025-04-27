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
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const moveTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), moveTowards: true });

    const rotateTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    rotateTowardsOffset.rotationOffset = 90;

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
            .waitUntilFinished();
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9))
                .delay(200)
            .effect()
                .file("jb2a.healing_generic.400px.green")
                .atLocation(target, targetHeightOffset)
                .scaleToObject(2.1)
                .isometric({ overlay: true })
                .delay(200)
                .xray()
                .aboveInterface()
                .waitUntilFinished();
    }
}
sequence.play();
