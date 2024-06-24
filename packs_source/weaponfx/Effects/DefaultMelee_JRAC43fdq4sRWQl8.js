const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_generic.slash.01.orange",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.static_electricity.03.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
    .effect()
        .file("jb2a.melee_generic.slash.01.orange")

        .atLocation(sourceToken)
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .stretchTo(target)
        .delay(500)
        .missed(targetsMissed.has(target.id));
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .delay(500)
        .waitUntilFinished(-1300);

    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
    .effect()
        .file("jb2a.static_electricity.03.blue")
        .playIf(!targetsMissed.has(target.id))
        .scaleToObject(0.5)
        .atLocation(target, { randomOffset: 0.8, gridUnits: true })
        .repeats(2, 80)
        .waitUntilFinished(-2200);
}
sequence.play();
