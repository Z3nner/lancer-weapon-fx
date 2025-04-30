const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/sprites/DRILL.png",
    "modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg",
    "jb2a.gust_of_wind.veryfast",
    "jb2a.impact.yellow",
]);

let sequence = new Sequence();

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

for (const target of targetTokens) {
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.4 });
    const moveTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            missed: targetsMissed.has(target.id),
            useAbsoluteCoords: true,
        });
    sequence
        .canvasPan() // windup shake
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 1000,
                fadeOutDuration: 150,
                fadeInDuration: 600,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .effect()
            .file("modules/lancer-weapon-fx/sprites/DRILL.png")
            .scale(0.6)
            .filter("Glow", { color: 0xd7d23c })
            .atLocation(sourceToken, heightOffset)
            .spriteOffset({ x: -10 * gridscale, y: 10 * gridscale })
            .moveTowards(moveTowardsOffset)
            .missed(targetsMissed.has(target.id))
            .moveSpeed(100)
            .aboveInterface()
            .xray()
            .rotate(140);

    if (!targetsMissed.has(target.id)) {
        sequence;
        for (let j = 0; j < 8; j++) {
            sequence
                .canvasPan()
                    .shake({
                    duration: 125,
                    fadeInDuration: 50,
                    fadeOutDuration: 50,
                    strength: 10 + j * 4, // increase strength with each iteration.
                    frequency: 25 - (6 - j) * 2,
                    rotation: false,
                })
                .delay(200 + j * 125);
        }
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
                .repeats(8, 125)
                .delay(200)
            .effect()
                .file("jb2a.gust_of_wind.veryfast")
                .scale(0.2)
                .atLocation(sourceToken, heightOffset)
                .moveTowards(moveTowardsOffset)
                .aboveInterface()
                .xray()
                .zIndex(2)
                .delay(50)
            .effect()
                .file("jb2a.impact.yellow")
                .scale(0.4)
                .delay(200)
                .zIndex(1)
                .atLocation(target, targetHeightOffsetRand)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .repeats(8, 125)
                .aboveInterface()
                .randomSpriteRotation()
                .xray()
                .waitUntilFinished();
    } else {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
                .repeats(2, 170)
                .delay(200);
    }
}
sequence.play();
