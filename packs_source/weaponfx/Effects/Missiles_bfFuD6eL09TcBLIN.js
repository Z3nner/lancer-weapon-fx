const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg",
    "modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg",
    "jb2a.pack_hound_missile.blue",
    "jb2a.explosion.01.orange",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
    "jb2a.impact.005.orange",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
        targetToken: target,
        missed: targetsMissed.has(target.id),
        tokenHeightPercent: 0.0,
    });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .timeRange(700, 2000);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.pack_hound_missile")
                .atLocation(sourceToken, heightOffset)
                .stretchTo(target, targetHeightOffset)
                .xray()
                .aboveInterface()
                .waitUntilFinished(-3200);
        sequence
            .effect()
                .file("jb2a.explosion.01.orange")
                .atLocation(target, targetHeightOffset)
                .scale(0.8)
                .zIndex(1)
                .xray()
                .aboveInterface()
                .waitUntilFinished(-1300)
            .canvasPan()
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 700,
                    fadeOutDuration: 300,
                    strength: 10,
                    frequency: 25,
                    rotation: false,
                }),
            );
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
                .waitUntilFinished(-8500);
    } else {
        // calculate a random offset for the target, it should always clear the token's radius
        const targetOffsetX = (Math.random() < 0.5 ? -1 : 1) * (target.width / 2 / canvas.grid.size);
        const targetOffsetY = (Math.random() < 0.5 ? -1 : 1) * (target.width / 2 / canvas.grid.size);

        const missedOffset = game.modules
            .get("lancer-weapon-fx")
            .api.getTokenHeightOffset({ targetToken: target, tokenHeightPercent: 0.0 });
        missedOffset.offset.x += targetOffsetX;
        missedOffset.offset.y -= targetOffsetY;

        sequence
            .effect()
                .file("jb2a.pack_hound_missile.blue")
                .atLocation(sourceToken, heightOffset)
                .stretchTo(target, missedOffset)
                .xray()
                .belowTokens()
                .waitUntilFinished(-3200);
        sequence
            .effect()
                .file("jb2a.impact.005.orange")
                .atLocation(target, missedOffset)
                .scale(0.8)
                .zIndex(1)
                .center()
                .xray()
                .rotate(-135)
                .rotateTowards(sourceToken)
                .belowTokens()
                .waitUntilFinished(-1300)
            .canvasPan() // a nice little shake on miss
                .playIf(targetsMissed.has(target.id))
                .shake(
                game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                    duration: 300,
                    fadeOutDuration: 200,
                    strength: 5,
                    frequency: 25,
                    rotation: false,
                }),
            );
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
                .waitUntilFinished(-8500);
    }
}
sequence.play();
