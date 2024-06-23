const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.spear.melee.01.white.2",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.impact.orange.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
        .file("jb2a.spear.melee.01.white.2")
        .filter("Glow", { color: 0x5f5858, innerStrength: 2, knockout: true, distance: 20 })
        .scale(0.8)
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id));
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .delay(950)
        .endTime(600)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .waitUntilFinished(-800);

    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
        .effect()
        .file("jb2a.impact.orange.3")
        .playIf(!targetsMissed.has(target.id))
        .scaleToObject(2)
        .atLocation(target)
        .waitUntilFinished();
}
sequence.play();
