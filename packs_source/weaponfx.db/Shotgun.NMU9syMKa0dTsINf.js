const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor)

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_cycle.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .delay(500);
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/shotgun_impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .delay(800);
    }
    sequence.effect()
       .file("jb2a.bullet.01.orange")
       .atLocation(sourceToken)
       .scale(0.9)
       .stretchTo(target, {randomOffset: 0.7})
       .missed(targetsMissed.has(target.id))
       .repeats(6)
       .delay(500)
       .waitUntilFinished(-100);
}
sequence.play();
