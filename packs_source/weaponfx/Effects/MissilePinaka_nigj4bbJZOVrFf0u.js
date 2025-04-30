const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

// Pinaka wants 2 missiles, so get 2 groups
const targetPoints = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 2);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg",
    "modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg",
    "jb2a.throwable.launch.missile.01.blue",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
    "jb2a.explosion.01.orange",
    "jb2a.explosion.08.orange",
]);

let sequence = new Sequence();

for (const targetPoint of targetPoints) {
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
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .timeRange(700, 2000);
    sequence
        .effect()
            .file("jb2a.throwable.launch.missile.01.blue")
            .atLocation(sourceToken, heightOffset)
            .stretchTo(targetPoint)
            .xray()
            .aboveInterface()
            .waitUntilFinished()
            .xray()
            .aboveInterface();
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 700,
                fadeOutDuration: 300,
                strength: 20,
                frequency: 25,
                rotation: false,
            }),
        )
        .effect()
            .file("jb2a.explosion.01.orange")
            .atLocation(targetPoint)
            .scale(1.2)
            .zIndex(2)
            .xray()
            .aboveInterface()
            .randomSpriteRotation();
    sequence
        .effect()
            .file("jb2a.explosion.08.orange")
            .atLocation(targetPoint)
            .scale(1.2)
            .zIndex(1)
            .xray()
            .aboveInterface()
            .randomSpriteRotation();
}
sequence.play();
