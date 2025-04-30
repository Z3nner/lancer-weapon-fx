const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/AR_Fire.ogg",
    "jb2a.bullet.01.orange",
    "emily3k.sfx.artillery.reload",
]);

let sequence = new Sequence();

// RELOAD BEFORE FIRING
sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/WeaponClick.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .waitUntilFinished(200);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const targetOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            sprayOffset: 0.3,
            randomOffset: 0.4,
            missed: targetsMissed.has(target.id),
        });

    // 3 shots
    const shots = 4;

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/AR_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
    // loop through the repeat count and increase the delay each time
    for (let j = 0; j < shots; j++) {
        sequence
            .canvasPan()
                .shake({
                duration: 100,
                fadeOutDuration: 80,
                strength: 10,
                frequency: 10,
                rotation: false,
            })
            .delay(100 + j * 100);
    }
    sequence
        .effect()
            .file("jb2a.bullet.01.orange")
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .aboveInterface()
            .repeats(shots, 100)
            .waitUntilFinished(-550);
}

sequence.play({ preload: true });
