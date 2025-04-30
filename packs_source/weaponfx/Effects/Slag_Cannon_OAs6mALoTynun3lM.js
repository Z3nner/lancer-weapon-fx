const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// get the average tokenheightoffset.x of the targetTokens
// use the tokenHeightOffset macro to get the height offset of the target tokens
// this is used to calculate the height of the effect
const targetHeightOffsets = await Promise.all(
    targetTokens.map(token => game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: token })),
);
const averageTokenHeightOffset =
    targetHeightOffsets.reduce((sum, offset) => sum + offset.offset.x, 0) / targetHeightOffsets.length;

// if we're isometric, add offset to the target height so it looks like the effect is targeting the average elevation
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    target.x += averageTokenHeightOffset * canvas.scene.grid.size;
    target.y -= averageTokenHeightOffset * canvas.scene.grid.size;
}

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/RetortLoop.ogg",
    "jb2a.breath_weapons02.burst.line",
    "jb2a.grease.dark_brown.loop",
]);

let sequence = new Sequence();

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/RetortLoop.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    // SPRAY
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 300,
            fadeOutDuration: 250,
            fadeInDuration: 50,
            strength: 10,
            frequency: 25,
            rotation: false,
        }),
    )
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 5067,
            fadeOutDuration: 2500,
            fadeInDuration: 500,
            strength: 4,
            frequency: 10,
            rotation: false,
        }),
    )
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 300,
            fadeOutDuration: 200,
            fadeInDuration: 50,
            strength: 10,
            frequency: 15,
            rotation: false,
        }),
    )
    .effect()
        .file("jb2a.breath_weapons02.burst.line")
        .atLocation(sourceToken, heightOffset)
        .filter("ColorMatrix", { hue: 180, brightness: 0.2, contrast: 0.5 })
        .filter("Glow", { distance: 0.5, color: 0xd6c194, innerStrength: 2 })
        .stretchTo(target)
        .xray()
        .aboveInterface()
        .playbackRate(1.5)
        .waitUntilFinished(-3500);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    let targetHeightOffsetFloorRand = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
        targetToken: target,
        tokenHeightPercent: 0.0,
        randomOffset: 2,
        missed: targetsMissed.has(target.id),
    });

    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.grease.dark_brown.loop")
                .opacity(0.8)
                .fadeIn(800)
                .fadeOut(800)
                .atLocation(target, targetHeightOffsetFloorRand)
                .belowTokens()
                .xray()
                .repeats(3)
                .scaleToObject(1);
    }
}
sequence.play();
