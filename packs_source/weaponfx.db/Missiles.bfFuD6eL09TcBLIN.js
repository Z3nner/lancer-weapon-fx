const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();
for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000);
    sequence.effect()
        .file("jb2a.pack_hound_missile")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .name(`impact${i}`)
        .waitUntilFinished(-3200);
    sequence.effect()
         .file("jb2a.explosion.01.orange")
         .atLocation(`impact${i}`)
         .scale(0.8)
         .zIndex(1)
         .waitUntilFinished(-1300);

    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
			.waitUntilFinished(-8000);

    }
}
sequence.play();