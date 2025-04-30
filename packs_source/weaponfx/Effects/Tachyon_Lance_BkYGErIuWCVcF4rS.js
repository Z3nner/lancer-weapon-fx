const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg",
    "jb2a.impact.orange.0",
    "modules/lancer-weapon-fx/soundfx/Annihilator.ogg",
    "jb2a.fireball.beam.orange",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    let targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: 0.3, missed: targetsMissed.has(target.id) });

    // SHOT
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 1600,
                fadeInDuration: 1000,
                fadeOutDuration: 100,
                strength: 3,
                frequency: 5,
                rotation: false,
            }),
        )
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished()
        .effect()
            .file("jb2a.fireball.beam.orange")
            .filter("ColorMatrix", { hue: 180 })
            .scale(1.25)
            .startTime(2300)
            .opacity(0.3)
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .aboveInterface();

    // IMPACT
    sequence
        .effect()
            .file("jb2a.impact.orange.0")
            .filter("ColorMatrix", { hue: 180 })
            .atLocation(target, targetHeightOffset)
            .playIf(!targetsMissed.has(target.id))
            .xray()
            .aboveInterface()
            .rotateTowards(sourceToken)
            .missed(targetsMissed.has(target.id))
        //.isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .rotate(230)
        .center()
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 700,
                fadeOutDuration: 500,
                strength: 15,
                frequency: 25,
                rotation: false,
            }),
        )
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .waitUntilFinished(-2800);
}
sequence.play();
