const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

// the first target token
const target = targetTokens[0];

// the calculated height of the target token (including scaling & elevation)
let targetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, sprayOffset: true, missed: targetsMissed.has(target.id) });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg",
    "jb2a.bullet.Snipe.blue",
    "jb2a.impact.orange.0",
    "modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg",
]);

let sequence = new Sequence()
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("jb2a.bullet.Snipe.blue")
        .tint("#9d9595")
        .atLocation(sourceToken, heightOffset)
        .stretchTo(target, targetHeightOffset)
        .xray()
        .aboveInterface()
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-1200);
if (!targetsMissed.has(target.id)) {
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 600,
                fadeOutDuration: 400,
                strength: 10,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(100);
    sequence
        .effect()
            .file("jb2a.impact.orange.0")
            .atLocation(target, targetHeightOffset)
            .rotateTowards(sourceToken)
            .rotate(230)
            .center()
            .xray()
            .aboveInterface()
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
}

sequence.play();
