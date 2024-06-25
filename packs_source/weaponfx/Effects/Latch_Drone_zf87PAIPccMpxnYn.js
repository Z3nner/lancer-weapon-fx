const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/sprites/LatchDrone.png",
    "modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg",
    "modules/lancer-weapon-fx/soundfx/Stabilize.ogg",
    "jb2a.healing_generic.400px.green",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
            .file("modules/lancer-weapon-fx/sprites/LatchDrone.png")
            .rotate(260)
            .atLocation(sourceToken)
            .rotateTowards(target)
            .moveTowards(target)
            .missed(targetsMissed.has(target.id))
            .moveSpeed(1200);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished();
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9))
                .delay(200)
            .effect()
                .file("jb2a.healing_generic.400px.green")
                .atLocation(target)
                .scale(0.5)
                .delay(200)
                .waitUntilFinished();
    }
}
sequence.play();
