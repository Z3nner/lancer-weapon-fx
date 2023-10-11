const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg")
        .delay(200)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.bolt.physical.orange")
        .atLocation(sourceToken)
        .startTime(500)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .delay(700)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
        sequence.effect()
            .file("jb2a.explosion.01.orange")
            .atLocation(target)
            .delay(700)
            .waitUntilFinished();
    }
}
sequence.play();
