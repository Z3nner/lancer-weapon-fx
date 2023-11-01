const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.warhammer.melee.01.white.4")
        .tint("#18f014")
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .delay(1300)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg")
            .delay(1550)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        sequence.effect()
            .file("jb2a.impact.blue.3")
            .scale(1.2)
            .tint("#18f014")
            .atLocation(target)
            .delay(1550)
            .waitUntilFinished(-1000);
    }
}
sequence.play();
