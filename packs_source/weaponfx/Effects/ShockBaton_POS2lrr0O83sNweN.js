const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.01.magic_sword.yellow",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.2",
    "jb2a.static_electricity.03",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });

    const targetHeightOffsetRand5 = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.5 });
    const targetHeightOffsetRand6 = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.6 });

    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 700,
                fadeOutDuration: 150,
                fadeInDuration: 250,
                strength: 5,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(500);
    sequence
        .effect()
            .file("jb2a.melee_attack.01.magic_sword.yellow")
            .delay(500)
            .scaleToObject(3)
            .filter("ColorMatrix", { hue: 180 })
            .atLocation(sourceToken, heightOffset)
            .moveTowards(targetMoveTowards)
            .xray()
            .aboveInterface()
            .waitUntilFinished(-1000)
            .missed(targetsMissed.has(target.id));
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished(-1450);

    // IMPACT
    sequence
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 600,
                fadeOutDuration: 400,
                strength: 10,
                frequency: 15,
                rotation: false,
            }),
        )
        .delay(100);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
        .effect()
            .file("jb2a.impact.blue.2")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject()
            .xray()
            .aboveInterface()
            .atLocation(target, targetHeightOffsetRand5)
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .waitUntilFinished(-1200);
    sequence
        .effect()
            .file("jb2a.static_electricity.03.blue")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(0.7)
            .xray()
            .aboveInterface()
            .atLocation(target, targetHeightOffsetRand6)
            .repeats(3, 75)
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .waitUntilFinished(-1200);
}
sequence.play();
