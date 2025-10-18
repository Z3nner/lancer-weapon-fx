const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.divine_smite.target.blueyellow",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.extras.tmfx.outpulse.circle.01.normal",
    "jb2a.impact.001",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.divine_smite.target.blueyellow")
            .scale(0.9)
            .tint("#8c0353")
            .atLocation(sourceToken)
            .moveTowards(target)
            .moveSpeed(175)
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
                .file("jb2a.extras.tmfx.outpulse.circle.01.normal")
                .atLocation(target, { randomOffset: 0.7, gridUnits: true })
                .scaleToObject(1.2)
                .tint("#8c0353")
                .filter("Glow", { color: 0x8a0303, distance: 1 })
                .repeats(3, 200)
                .playbackRate(2)
                .belowTokens()
                .delay(800);

        sequence
            .effect()
                .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
                .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
                .file("jb2a.impact.001")
                .scaleToObject(1.2)
                .tint("#8c0353")
                .filter("Glow", { color: 0x8a0303, distance: 1 })
                .atLocation(target, { randomOffset: 0.9, gridUnits: true })
                .repeats(6, 120)
                .delay(1200)
                .waitUntilFinished(-1500);
    }
}
sequence.play();
