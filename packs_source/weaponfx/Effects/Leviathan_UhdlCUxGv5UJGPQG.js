const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Leviathan.ogg",
    "jb2a.bullet.01.orange",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Leviathan.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .delay(500)
        .waitUntilFinished(-2100);
    sequence
    .effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(target, { randomOffset: 0.3 })
        .missed(targetsMissed.has(target.id))
        .name(`impact${i}`)
        .scale(0.5)
        .waitUntilFinished(-775);
    sequence
    .effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(`impact${i}`, { randomOffset: 0.6, gridUnits: true })
        .repeats(7, 30)
        .scale(0.5)
        .waitUntilFinished();
}

sequence.play();
