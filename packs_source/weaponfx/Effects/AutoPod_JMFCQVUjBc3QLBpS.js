const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg",
    "jb2a.template_circle.vortex.loop.blue",
    "modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg",
    "jb2a.impact.yellow.1",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
    .effect()
        .file("jb2a.template_circle.vortex.loop.blue")
        .endTime(4700)
        .scale(0.2)
        .tint("#787878")
        .atLocation(sourceToken)
        .moveTowards(target)
        .waitUntilFinished();
    sequence.sound().file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg").volume(0.7);
    sequence.effect().file("jb2a.impact.yellow.1").scale(0.6).atLocation(target);
}
sequence.play();
