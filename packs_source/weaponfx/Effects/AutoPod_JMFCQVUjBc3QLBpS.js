const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg",
    "jb2a.template_circle.vortex.loop.blue",
    "modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg",
    "jb2a.impact.yellow.1",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const moveTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), moveTowards: true });

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
            .atLocation(sourceToken, heightOffset)
            .aboveInterface()
            .xray()
            .moveTowards(moveTowardsOffset)
            .waitUntilFinished();
    sequence.sound().file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg").volume(0.7);
    sequence
        .effect()
            .file("jb2a.impact.yellow.1")
            .scale(0.6)
            .aboveInterface()
            .isometric({ overlay: true })
            .xray()
            .atLocation(target, targetHeightOffset);
}
sequence.play();
