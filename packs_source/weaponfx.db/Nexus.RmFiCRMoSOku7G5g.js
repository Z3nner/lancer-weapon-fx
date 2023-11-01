const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Nexus_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("modules/animated-spell-effects/spell-effects/energy/energy_throw_RAY_10.webm")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .scale({x: 1.0, y: .5})
        .waitUntilFinished(-1300);
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Nexus_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.4));
        sequence.effect()
            .file("modules/animated-spell-effects/spell-effects/energy/energy_explosion_CIRCLE_05.webm")
            .atLocation(target)
            .scale(1.3)
            .zIndex(1)
            .waitUntilFinished(-1700);
    }
}
sequence.play();
