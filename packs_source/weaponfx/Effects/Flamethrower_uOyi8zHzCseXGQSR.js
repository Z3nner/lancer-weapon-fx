const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.burning_hands.01.orange",
    "modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg",
    "jb2a.flames.02.orange",
]);

// get the average document.elevation of the targetTokens
// this is used to calculate the height of the effect
const averageElevation = targetTokens.reduce((sum, token) => sum + token.document.elevation, 0) / targetTokens.length;

target.x += averageElevation * canvas.scene.grid.size;
target.y -= averageElevation * canvas.scene.grid.size;

let sequence = new Sequence()
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
            duration: 5567,
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
    .delay(2867)
    .effect()
        .file("jb2a.burning_hands.01.orange")
        .atLocation(sourceToken, heightOffset)
        .rotateTowards(target)
        .xray()
        .aboveInterface()
        .scale({ x: 0.75, y: 1.0 })
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-3000);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    // BURN ON TARGETS HIT
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.flames.02.orange")
                .opacity(0.7)
                .fadeIn(800)
                .fadeOut(800)
                .atLocation(target, targetHeightOffset)
                .aboveInterface()
                .center()
                .xray()
                .isometric({ overlay: true })
                .scaleToObject(1.2);
    }
}
sequence.play();
