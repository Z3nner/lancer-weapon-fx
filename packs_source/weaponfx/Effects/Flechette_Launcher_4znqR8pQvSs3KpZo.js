const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });
const heightOffsetFlat = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, tokenHeightPercent: 0.0 });
const heightOffsetFlat2 = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, randomOffset: 2.5 });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Flechette.ogg",
    "jb2a.explosion.shrapnel.bomb.01.black",
    "jb2a.explosion.04.blue",
    "jb2a.impact.yellow",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 200,
            fadeOutDuration: 100,
            strength: 14,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(300)
    .effect()
        .file("jb2a.explosion.04.blue")
        .playbackRate(2)
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(2)
        .aboveInterface()
        .xray()
        .waitUntilFinished()
    .effect()
        .file("jb2a.explosion.shrapnel.bomb.01.black")
        .scale(0.6)
        .belowTokens()
        .xray()
        .atLocation(sourceToken, heightOffsetFlat);
for (let j = 0; j < 6; j++) {
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 30,
                fadeOutDuration: 20,
                strength: 20,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(j * 20);
}
sequence
    .effect()
        .file("jb2a.impact.yellow")
        .scale(0.5)
        .repeats(6, 20)
        .aboveInterface()
        .xray()
        .atLocation(sourceToken, heightOffsetFlat2);

sequence.play();
