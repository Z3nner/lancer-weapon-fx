const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_generic.slash.01.orange",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg",
    "jb2a.explosion.01",
    "jb2a.static_electricity.03.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.melee_generic.slash.01.orange")
            .scaleToObject(4)
            .atLocation(sourceToken)
            .spriteOffset({ x: -1.5 }, { gridUnits: true })
            .rotateTowards(target)
            .delay(500)
            .missed(targetsMissed.has(target.id));
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .delay(500)
            .waitUntilFinished(-1300);
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        sequence
            .effect()
                .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
                .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
                .file("jb2a.explosion.01")
                .scale(1)
                .zIndex(2)
                .atLocation(target, { randomOffset: 0.5, gridUnits: true });
        sequence
            .effect()
                .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
                .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
                .file("jb2a.static_electricity.03.blue")
                .scale(0.4)
                .atLocation(target, { randomOffset: 1, gridUnits: true })
                .repeats(2, 80)
                .waitUntilFinished(-800);
    }
}
sequence.play();
