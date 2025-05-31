const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const centerMass = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// if we're isometric, add the elevation offset
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    // get the average document.elevation of the targetTokens
    // this is used to calculate the height of the effect
    const averageElevation =
        targetTokens.reduce((sum, token) => sum + token.document.elevation, 0) / targetTokens.length;

    centerMass.x += averageElevation * canvas.scene.grid.size;
    centerMass.y -= averageElevation * canvas.scene.grid.size;
}

const repeatImpactAnimationForEachTarget = async function (sequence, targetTokens) {
    for (const t of targetTokens) {
        if (!targetsMissed.has(t.id)) {
            const targetHeightOffset = game.modules
                .get("lancer-weapon-fx")
                .api.getTokenHeightOffset({ targetToken: t, tokenHeightPercent: 0.0 });

            sequence
                .effect()
                    .file("jb2a.explosion_side.01.orange")
                    .atLocation(t, targetHeightOffset)
                    .rotateTowards(centerMass)
                    .scale(0.7)
                    .center();
        }
    }
    return sequence;
};

await Sequencer.Preloader.preloadForClients([
    "jb2a.explosion_side.01.orange",
    "modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg",
    "jb2a.smoke.puff.side.02.white",
    "jb2a.bullet.02.orange",
    "jb2a.explosion.shrapnel.bomb.01.black",
    "jb2a.explosion.08.orange",
    "modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg",
]);

let sequence = new Sequence();

sequence
    // FIRING
    .canvasPan() // initial blast
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 300,
            fadeOutDuration: 100,
            strength: 15,
            frequency: 25,
            rotation: false,
        }),
    )
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
    .effect()
        .file("jb2a.smoke.puff.side.02.white")
        .atLocation(sourceToken, heightOffset)
        .rotateTowards(centerMass)
        .aboveInterface()
        .xray()
        .scale({ y: 0.5 })
    .effect()
        .file("jb2a.bullet.02.orange")
        .atLocation(sourceToken, heightOffset)
        .stretchTo(centerMass)
        .playbackRate(0.7)
        .aboveInterface()
        .xray()
        .waitUntilFinished(-650);
// IMPACT
sequence
    .canvasPan() // explosion
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 2000,
            fadeOutDuration: 1000,
            fadeInDuration: 100,
            strength: 15,
            frequency: 25,
            rotation: false,
        }),
    )
    .effect()
        .file("jb2a.explosion.shrapnel.bomb.01.black")
        .atLocation(centerMass)
        .aboveInterface()
        .xray()
        .randomSpriteRotation()
        .scale(0.5);
sequence
    .effect()
        .file("jb2a.explosion.08.orange")
        .atLocation(centerMass)
        .rotateTowards(sourceToken)
        .rotate(180)
        .aboveInterface()
        .xray()
        .randomSpriteRotation()
        .center();
sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));

sequence = await repeatImpactAnimationForEachTarget(sequence, targetTokens);

sequence.play();
