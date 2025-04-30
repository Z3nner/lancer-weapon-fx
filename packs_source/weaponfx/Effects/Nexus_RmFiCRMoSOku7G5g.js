const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// if we're isometric, add offset to the target height so it looks like the effect is targeting the average elevation
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    // get the average tokenheightoffset.x of the targetTokens
    // use the tokenHeightOffset macro to get the height offset of the target tokens
    // this is used to calculate the height of the effect
    const targetHeightOffsets = await Promise.all(
        targetTokens.map(token =>
            game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: token }),
        ),
    );
    const averageTokenHeightOffset =
        targetHeightOffsets.reduce((sum, offset) => sum + offset.offset.x, 0) / targetHeightOffsets.length;

    pTarget.x += averageTokenHeightOffset * canvas.scene.grid.size;
    pTarget.y -= averageTokenHeightOffset * canvas.scene.grid.size;
}

// Calculate the point 70% of the distance between sourceToken and pTarget
const pBlast = {
    x: sourceToken.position.x + 0.7 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.7 * (pTarget.y - sourceToken.position.y),
};

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/NexusReady.ogg",
    "modules/lancer-weapon-fx/soundfx/NexusFire.ogg",
    "jb2a.bullet.01.orange",
    "jb2a.side_impact.part.smoke.blue",
    "jb2a.impact.004.blue",
    "jb2a.zoning.inward.circle.loop",
    "modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg",
]);

let sequence = new Sequence()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/NexusReady.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished();
sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/NexusFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 150);
for (let j = 0; j < 3; j++) {
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 100,
                fadeOutDuration: 100,
                strength: 15,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(j * 150);
}
sequence
    .effect()
        .file("jb2a.bullet.01.orange")
        .filter("ColorMatrix", { hue: 070 })
        .filter("Blur", { blur: 8, strength: 4, blurX: 4 })
        .atLocation(sourceToken, heightOffset)
        .stretchTo(pBlast, { randomOffset: 0.6 })
        .aboveInterface()
        .xray()
        .repeats(3, 150)
        .waitUntilFinished(-800);

sequence
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 1200,
            fadeOutDuration: 600,
            fadeInDuration: 800,
            strength: 15,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(150)
    .effect()
        .file("jb2a.side_impact.part.smoke.blue")
        .filter("ColorMatrix", { hue: 230, brightness: 0.5 })
        .scale(0.8)
        .atLocation(pBlast, { randomOffset: 0.1 })
        .aboveInterface()
        .xray()
        .rotateTowards(pTarget)
        .repeats(3, 150)
        .waitUntilFinished(-2200);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    let targetHeightOffsetFloor = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
        targetToken: target,
        tokenHeightPercent: 0.0,
        missed: targetsMissed.has(target.id),
    });
    let targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.7, missed: targetsMissed.has(target.id) });

    for (let j = 0; j < 3; j++) {
        sequence
            .canvasPan()
                .playIf(!targetsMissed.has(target.id))
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 100,
                    fadeOutDuration: 75,
                    strength: 15,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .delay(j * 125);
    }
    sequence
        .effect()
            .file("jb2a.impact.004.blue")
            .playIf(!targetsMissed.has(target.id))
            .filter("ColorMatrix", { hue: 235, brightness: 0.5 })
            .scale(0.5)
            .aboveInterface()
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .xray()
            .zIndex(1)
            .atLocation(target, targetHeightOffsetRand)
            .repeats(3, 125);
    sequence
        .effect()
            .file("jb2a.zoning.inward.circle.loop")
            .playIf(!targetsMissed.has(target.id))
        //.scale(0.4)
        .fadeOut(3800, { ease: "easeOutBack" })
        .scaleToObject(1)
        .xray()
        .belowTokens()
        .atLocation(target, targetHeightOffsetFloor);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .playIf(!targetsMissed.has(target.id));
}

sequence.play();
