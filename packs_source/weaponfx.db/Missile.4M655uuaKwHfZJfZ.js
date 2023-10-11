const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("modules/animated-spell-effects/spell-effects/air/black_smoke_RAY_01.webm")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .scale({x: 1.0, y: .5})
        .waitUntilFinished(-3700);
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
        sequence.effect()
            .file("jb2a.explosion.01.orange")
            .atLocation(target)
            .scale(1.3)
            .zIndex(1)
            .waitUntilFinished(-1200);
    }
}
sequence.play();
