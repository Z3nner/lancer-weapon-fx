const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg",
    "jb2a.bolt.physical.orange",
    "jb2a.explosion.01.orange",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: true, missed: targetsMissed.has(target.id) });

    // BOLT LAUNCH
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg")
            .delay(200)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 200,
                fadeOutDuration: 100,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(300)
        .effect()
            .file("jb2a.bolt.physical.orange")
            .atLocation(sourceToken, heightOffset)
            .startTime(500)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .name("bolt")
            .aboveInterface()
            .xray()
            .waitUntilFinished(-400);
    // BOLT IMPACT
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .delay(50)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1))
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake({
            duration: 500,
            fadeOutDuration: 300,
            strength: 14,
            frequency: 25,
            rotation: false,
        })
        .delay(300)
        .effect()
            .file("jb2a.explosion.01.orange")
            .atLocation(target, targetHeightOffset)
            .playIf(!targetsMissed.has(target.id))
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .aboveInterface()
            .xray()
            .randomSpriteRotation()
            .waitUntilFinished();
}
sequence.play();
