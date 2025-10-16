const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/BR_Fire.ogg",
    "jb2a.bullet.03.blue",
    "modules/lancer-weapon-fx/soundfx/KineticImpact.ogg",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    // repeat the effect between 2 and 3 times, with a 25% chance of it being 3 times
    const repeatCount = Math.random() < 0.25 ? 3 : 2;

    //loop through the repeat count
    for (let j = 0; j < repeatCount; j++) {
        const targetOffset = game.modules
            .get("lancer-weapon-fx")
            .api.getTokenHeightOffset({ targetToken: target, sprayOffset: 0.6, missed: targetsMissed.has(target.id) });
        // SHOT
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/BR_Fire.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
                .duration(933)
                .delay(200)
            .canvasPan()
                .playIf(!targetsMissed.has(target.id))
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 400,
                    fadeOutDuration: 300,
                    strength: 4,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .delay(200)
            .effect()
                .file("jb2a.bullet.03.blue")
                .atLocation(sourceToken, heightOffset)
                .scale(0.7)
                .zIndex(1)
                .playbackRate(1.5)
                .stretchTo(target, targetOffset)
                .missed(targetsMissed.has(target.id))
                .delay(200)
                .xray()
                .aboveInterface()
                .waitUntilFinished(-400);
        // IMPACT
        sequence
            .canvasPan()
                .playIf(!targetsMissed.has(target.id))
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 500,
                    fadeOutDuration: 300,
                    fadeInDuration: 50,
                    strength: 10,
                    frequency: 25,
                    rotation: false,
                }),
            )
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/KineticImpact.ogg")
                .playIf(!targetsMissed.has(target.id))
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .effect()
                .file("jb2a.impact.blue.0")
                .playIf(!targetsMissed.has(target.id))
                .scaleToObject(1.5)
                .zIndex(2)
                .atLocation(target, targetOffset)
                .rotateTowards(sourceToken)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .rotate(230)
                .xray()
                .aboveInterface()
                .randomSpriteRotation()
                .center();
    }
}
sequence.play();
