const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/AssaultCannonFire.ogg",
    "jb2a.bullet.01.orange",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    let targetOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
        targetToken: target,
        sprayOffset: true,
        randomOffset: 0.5,
        missed: targetsMissed.has(target.id),
    });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/AssaultCannonFire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    for (let j = 0; j < 8; j++) {
        sequence
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 50,
                    fadeOutDuration: 30,
                    strength: 15,
                    frequency: 15,
                    rotation: false,
                }),
            )
            .delay(j * 50);
    }
    sequence
        .effect()
            .file("jb2a.bullet.01.orange")
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .aboveInterface()
            .repeats(8, 50)
            .scale(0.5)
            .waitUntilFinished(-800);
    sequence.canvasPan().shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 1000,
            fadeOutDuration: 1000,
            strength: 10,
            frequency: 25,
            rotation: false,
        }),
    );
}

sequence.play();
