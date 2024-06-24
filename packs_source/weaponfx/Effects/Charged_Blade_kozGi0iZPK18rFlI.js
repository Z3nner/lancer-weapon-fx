const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.01.magic_sword.yellow",
    "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
    .effect()
        .file("jb2a.melee_attack.01.magic_sword.yellow")
        .filter("ColorMatrix", { hue: 180 })
        .delay(500)
        .scaleToObject(4.5)
        .atLocation(sourceToken)
        .moveTowards(target)
        .waitUntilFinished(-1000)
        .missed(targetsMissed.has(target.id));
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-1450);

    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
    .effect()
        .file("jb2a.impact.blue.3")
        .playIf(!targetsMissed.has(target.id))
        .scaleToObject(2)
        .atLocation(target)
        .waitUntilFinished(-1200);
}
sequence.play();
