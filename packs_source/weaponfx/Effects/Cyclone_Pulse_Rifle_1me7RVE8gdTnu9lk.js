const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg",
    "jb2a.magic_missile.purple",
    "modules/lancer-weapon-fx/soundfx/CPR_Impact.ogg",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(5, 125);

    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.magic_missile.purple")
            .filter("ColorMatrix", { hue: 220 })
            .atLocation(sourceToken)
            .stretchTo(target, { randomOffset: 0.4 })
            .missed(targetsMissed.has(target.id))
            .repeats(5, 125)
            .waitUntilFinished(-1600);
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/CPR_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
                .repeats(5, 125)
                .waitUntilFinished();
    }
}
sequence.play();
