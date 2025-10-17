const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.divine_smite.target.blueyellow",
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
            .file("jb2a.divine_smite.target.blueyellow")
            .scale(0.9)
            .tint("#066605")
            .atLocation(sourceToken)
            .moveTowards(target)
            .moveSpeed(300)
            .spriteOffset({ x: 0, y: 100, gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .rotate(90)
            .delay(500)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .delay(500)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
                .delay(800)
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        sequence
            .effect()
                .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
                .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
                .file("jb2a.impact.blue")
                .scale(0.5)
                .tint("#066605")
                .atLocation(target, { randomOffset: 1 })
                .repeats(4, 80)
                .delay(1200)
                .waitUntilFinished(-1500);
    }
}
sequence.play();
