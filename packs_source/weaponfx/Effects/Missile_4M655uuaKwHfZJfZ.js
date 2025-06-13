const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// if we're isometric, add the elevation offset
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    // get the average elevation of the targets
    // this is used to calculate the height of the effect
    const averageElevation =
        targetTokens.reduce((sum, token) => sum + token.document.elevation, 0) / targetTokens.length;

    target.x += averageElevation * canvas.scene.grid.size;
    target.y -= averageElevation * canvas.scene.grid.size;
}

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg",
    "modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg",
    "jb2a.pack_hound_missile.blue.01",
    "jb2a.explosion.01.orange",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
]);

let sequence = new Sequence();

// MISSILE LAUNCH
sequence
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 100,
            strength: 8,
            frequency: 10,
            rotation: false,
        }),
    )
    .delay(300)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000)
    .effect()
        .file("jb2a.pack_hound_missile.blue.01")
        .atLocation(sourceToken, heightOffset)
        .stretchTo(target)
        .aboveInterface()
        .xray()
        .waitUntilFinished(-3200);
// MISSILE IMPACT
sequence
    .canvasPan()
        .playIf(!targetsMissed.has(target.id))
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 700,
            fadeOutDuration: 300,
            strength: 20,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(300)
    .effect()
        .file("jb2a.explosion.01.orange")
        .atLocation(target)
        .scale(1.2)
        .aboveInterface()
        .randomRotation()
        .xray()
        .zIndex(1)
        .waitUntilFinished(-1300)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));

sequence.play({ preload: true });
