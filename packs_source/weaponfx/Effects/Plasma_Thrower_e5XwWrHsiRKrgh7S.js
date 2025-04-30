const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg",
    "jb2a.breath_weapons02.burst.cone.fire.orange.02",
    "jb2a.flames.02.orange",
]);

// get the average document.elevation of the targetTokens
// this is used to calculate the height of the effect
const averageElevation = targetTokens.reduce((sum, token) => sum + token.document.elevation, 0) / targetTokens.length;

// if we're isometric, add offset to the target height so it looks like the effect is targeting the average elevation
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    target.x += averageElevation * canvas.scene.grid.size;
    target.y -= averageElevation * canvas.scene.grid.size;
}

let sequence = new Sequence();

// SPRAY
sequence
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 500,
            fadeOutDuration: 250,
            fadeInDuration: 50,
            strength: 14,
            frequency: 25,
            rotation: false,
        }),
    )
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 3867,
            fadeOutDuration: 1500,
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
    );
sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .effect()
        .file("jb2a.breath_weapons02.burst.cone.fire.orange.02")
        .atLocation(sourceToken, heightOffset)
        .filter("ColorMatrix", { hue: 270 })
        .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
        .scale({ x: 0.9 })
        .xray()
        .aboveInterface()
        .playbackRate(1.6)
        .rotateTowards(target)
        .waitUntilFinished(-3500);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.flames.02.orange")
                .filter("ColorMatrix", { hue: 270 })
                .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
                .opacity(0.7)
                .fadeIn(800)
                .fadeOut(800)
                .aboveInterface()
                .xray()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .atLocation(target, targetHeightOffset)
                .scaleToObject(2);
    }
}
sequence.play();
