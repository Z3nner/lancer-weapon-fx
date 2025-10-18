const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.03.greatsword",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.impact.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.melee_attack.03.greatsword")
            .tint("#080303")
            .filter("Glow", { color: 0x8f0f0f })
            .scaleToObject(4.5)
            .atLocation(sourceToken)
            .moveTowards(target)
            .missed(targetsMissed.has(target.id))
            .waitUntilFinished(-2500);

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .delay(500)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished(-1350);

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

        sequence
            .effect()
                .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
                .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
                .file("jb2a.impact.blue")
                .scaleToObject(2)
                .atLocation(target)
                .waitUntilFinished(-1500);
    }
}
sequence.play();
