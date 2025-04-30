const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.greataxe.melee.standard.white",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg",
    "jb2a.impact.blue.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            missed: targetsMissed.has(target.id),
            useAbsoluteCoords: true,
        });
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    sequence
        .canvasPan() // windup shake
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 1000,
                fadeOutDuration: 150,
                fadeInDuration: 600,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .effect()
            .file("jb2a.greataxe.melee.standard.white")
            .tint("#c91af9")
            .scale(0.8)
            .atLocation(sourceToken, heightOffset)
            .moveTowards(targetMoveTowards)
            .missed(targetsMissed.has(target.id))
            .waitUntilFinished(-1200)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg")
            .playIf(!targetsMissed.has(target.id))
            .delay(275)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .canvasPan() // IMPACT SHAKE
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 300,
                strength: 40,
                frequency: 15,
                rotation: false,
            }),
        )
        .delay(275);
    sequence
        .effect()
            .file("jb2a.impact.blue.3")
            .playIf(!targetsMissed.has(target.id))
            .delay(275)
            .scaleToObject(2)
            .tint("#c91af9")
            .atLocation(target, targetHeightOffset)
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .waitUntilFinished(-1000);
}
sequence.play();
