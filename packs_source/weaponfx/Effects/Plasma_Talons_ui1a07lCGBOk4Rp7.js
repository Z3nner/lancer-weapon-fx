const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.claws.400px.red",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.2",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), randomOffset: true });

    sequence
        .effect()
            .file("jb2a.claws.400px.red")
        //.scale(0.8)
        .zIndex(1)
        .opacity(0.6)
        .scaleToObject(2)
        .isometric({ overlay: true })
        .xray()
        .aboveInterface()
        .atLocation(target, targetHeightOffset)
        .missed(targetsMissed.has(target.id));
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(2, 250);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.impact.blue.2")
                .scale(1.0)
                .tint("#c91af9")
                .atLocation(target, targetHeightOffsetRand)
                .delay(200)
                .xray()
                .aboveInterface()
                .repeats(2, 250);
    }
}
sequence.play();
