const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients(["modules/lancer-weapon-fx/soundfx/AR_Fire.ogg", "jb2a.bullet.01.orange"]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AR_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
    .effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .name(`impact${i}`)
        .waitUntilFinished(-550);
    sequence
    .effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(`impact${i}`, { randomOffset: 0.4, gridUnits: true })
        .repeats(3, 100)
        .waitUntilFinished();
}

sequence.play();
