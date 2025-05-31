const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = targetTokens[0];

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg",
    "jb2a.lightning_ball.blue",
    "modules/lancer-weapon-fx/soundfx/AirBurst.ogg",
    "jb2a.explosion.02.blue",
]);

const targetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
const moveTowardsOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), useAbsoluteCoords: true });

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 200,
            strength: 4,
            frequency: 25,
            rotation: false,
        }),
    )
    .effect()
        .file("jb2a.lightning_ball.blue")
        .endTime(1500)
        .scale(0.2)
        .atLocation(sourceToken, heightOffset)
        .moveTowards(moveTowardsOffset, { rotate: false })
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .missed(targetsMissed.has(target.id))
        .aboveInterface()
        .xray()
        .waitUntilFinished();

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AirBurst.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 500,
            fadeInDuration: 100,
            fadeOutDuration: 200,
            strength: 8,
            frequency: 25,
            rotation: false,
        }),
    )
    .playIf(!targetsMissed.has(target.id))
    .effect()
        .file("jb2a.explosion.02.blue")
        .playIf(!targetsMissed.has(target.id))
        .scale(0.5)
        .atLocation(target, targetHeightOffset)
        .aboveInterface()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .randomSpriteRotation()
        .waitUntilFinished();

sequence.play();
