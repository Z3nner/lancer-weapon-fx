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
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), randomOffset: 0.5 });

    sequence;
    sequence
        .effect()
            .file("jb2a.claws.400px.red")
            .filter("Glow", { color: 0x33ddff, distance: 4, knockout: true })
            .scaleToObject(1.7)
            .zIndex(1)
            .opacity(0.8)
            .atLocation(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .isometric({ overlay: true })
            .aboveInterface();
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(2, 250);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.static_electricity.03.blue")
                .atLocation(target, targetHeightOffset)
                .scaleToObject(1.5)
                .opacity(0.8)
                .repeats(3, 300)
                .delay(500)
                .mask(target)
                .isometric({ overlay: true })
                .xray()
                .aboveInterface()
            .effect()
                .file("jb2a.impact.blue.2")
                .scaleToObject(1.5)
                .atLocation(target, targetHeightOffsetRand)
                .mask(target)
                .delay(200)
                .opacity(0.8)
                .repeats(2, 250)
                .isometric({ overlay: true })
                .xray()
                .aboveInterface();
    }
}
sequence.play();
