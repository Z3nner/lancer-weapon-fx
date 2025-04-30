const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.01.magic_sword.yellow",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.3",
    "jb2a.static_electricity.03.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffsetRand2 = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.2 });
    const targetHeightOffsetRand8 = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.8 });

    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });

    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 150,
                fadeInDuration: 250,
                strength: 12,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(700)
        .effect()
            .file("jb2a.melee_attack.01.magic_sword.yellow")
            .delay(500)
            .scaleToObject(6)
            .filter("ColorMatrix", { hue: 180 })
            .atLocation(sourceToken, heightOffset)
            .moveTowards(targetMoveTowards)
            .waitUntilFinished(-1000)
            .xray()
            .aboveInterface()
            .randomizeMirrorX()
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
                duration: 1000,
                fadeOutDuration: 800,
                strength: 25,
                frequency: 15,
                rotation: false,
            }),
        )
        .delay(100)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .effect()
            .file("jb2a.impact.blue.3")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(2)
            .atLocation(target, targetHeightOffsetRand2)
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .xray()
            .aboveInterface()
            .waitUntilFinished(-1200);
    sequence
        .effect()
            .file("jb2a.static_electricity.03.blue")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject()
            .atLocation(target, targetHeightOffsetRand8)
            .repeats(3, 75)
            .opacity(0.8)
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .xray()
            .aboveInterface()
            .waitUntilFinished(-1200);
}
sequence.play();
