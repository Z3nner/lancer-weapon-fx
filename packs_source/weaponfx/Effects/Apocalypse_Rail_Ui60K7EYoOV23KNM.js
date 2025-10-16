const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/APR2_Load.ogg",
    "modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg",
    "jb2a.bullet.01.orange",
    "jb2a.fireball.explosion.orange",
    "modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg",
]);

let sequence = new Sequence()
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 1000,
            fadeOutDuration: 100,
            strength: 8,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(500)
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 100,
            strength: 20,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(1500)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished()

    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 200,
            strength: 10,
            frequency: 20,
            rotation: false,
        }),
    )
    .delay(200)

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

    .effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(target)
        .scale(2.0)
        .xray()
        .aboveInterface()
        .waitUntilFinished(-300);

sequence

    .effect()
        .file("jb2a.fireball.explosion.orange")
        .atLocation(target)
        .xray()
        .aboveInterface()
        .zIndex(1)
    .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .atLocation(target)
        .xray()
        .animateProperty("sprite", "scale.x", { from: 1, to: 10, duration: 2000, gridUnits: true, ease: "easeOutSine" })
        .animateProperty("sprite", "scale.y", { from: 1, to: 10, duration: 2000, gridUnits: true, ease: "easeOutSine" })
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 500,
            fadeInDuration: 50,
            fadeOutDuration: 200,
            strength: 50,
            frequency: 25,
            rotation: false,
        }),
    )
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 2500,
            fadeInDuration: 100,
            fadeOutDuration: 1500,
            strength: 20,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(500)

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

sequence.play();
