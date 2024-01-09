const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/WeaponBeep.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Fire.ogg")
        .delay(400)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.fireball.beam.orange")
        .scale(1.25)
        .startTime(1500)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));

        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Hit.ogg")
            .playIf(!targetsMissed.has(target.id))
            .delay(700)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
        sequence.effect()
            .file("jb2a.impact.orange.3")
            .playIf(!targetsMissed.has(target.id))
            .atLocation(target)
            .delay(700)
            .waitUntilFinished();
}
sequence.play();