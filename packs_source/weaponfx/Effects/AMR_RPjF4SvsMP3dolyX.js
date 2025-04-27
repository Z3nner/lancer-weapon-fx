const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/WeaponClick.ogg",
    "modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg",
    "jb2a.bullet.Snipe.blue",
    "modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    //get the height of the target
    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({
        targetToken: target,
        sprayOffset: true,
        missed: targetsMissed.has(target.id),
    });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/WeaponClick.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished(200)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
    sequence
        .effect()
            .file("jb2a.bullet.Snipe.blue")
            .filter("ColorMatrix", { hue: 200 })
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .xray()
            .aboveInterface()
            .missed(targetsMissed.has(target.id))
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 200,
                fadeOutDuration: 200,
                intensity: 2,
                speed: 5,
                rotation: false,
            }),
        )
        .delay(100);
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
                .delay(75);
        sequence
            .effect()
                .file("jb2a.impact.001.orange")
                .atLocation(target, targetHeightOffset)
                .isomtric({ overlay: true })
                .center()
                .delay(75)
                .xray()
                .aboveInterface()
                .waitUntilFinished();
    }
}
sequence.play();
