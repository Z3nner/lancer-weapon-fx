const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });
const tokenHeight = sourceToken.verticalHeight;
const rotateTowardsOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
    targetToken: sourceToken,
    useAbsoluteCoords: true,
});

// the targeted token
const target = targetTokens[0];

// the calculated height of the targeted token (including scaling & elevation)
const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/APR2_Load.ogg",
    "modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg",
    "jb2a.lasershot.green",
    "jb2a.toll_the_dead.green.shockwave",
    "jb2a.smoke.puff.side.02.white",
    "modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg",
]);

let sequence = new Sequence()
    // LOADING
    .canvasPan() // first loading tink
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            strength: 10,
            frequency: 15,
            rotation: false,
        }),
    )
    .delay(450)
    .canvasPan() // loading drone/riser
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 1000,
            fadeOutDuration: 50,
            fadeInDuration: 900,
            strength: 5,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(550)
    .canvasPan() // second loading tink
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            strength: 10,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(1550)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished()
    // FIRING
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 75,
            fadeInDuration: 25,
            strength: 15,
            frequency: 25,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("jb2a.lasershot.green")
        .atLocation(sourceToken, heightOffset)
        .stretchTo(target, targetHeightOffset)
        .missed(targetsMissed.has(target.id))
        .scale(tokenHeight)
        .aboveInterface()
        .xray()
        .waitUntilFinished(-400);
if (!targetsMissed.has(target.id)) {
    // IMPACT
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 1500,
                fadeOutDuration: 1200,
                fadeInDuration: 50,
                strength: 15,
                frequency: 15,
                rotation: false,
            }),
        )
        .effect()
            .file("jb2a.toll_the_dead.green.shockwave")
            .atLocation(target, targetHeightOffset)
            .scaleToObject(1.5)
            .aboveInterface()
            .xray()
        //.randomSpriteRotation()
        .zIndex(1)
        .effect()
            .file("jb2a.smoke.puff.side.02.white")
            .atLocation(target, targetHeightOffset)
            .rotateTowards(rotateTowardsOffset)
            .spriteOffset({ x: 0.5, y: 0 }, { gridUnits: true })
            .rotate(180)
            .aboveInterface()
            .xray()
            .zIndex(1)
            .tint("#43b918")
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
}

sequence.play({ preload: true });
