const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.warhammer.melee.01.white.4")
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .delay(1300)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/HammerImpact.ogg")
            .delay(1350)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9));
        sequence.effect()
            .file("jb2a.impact.ground_crack.orange")
            .atLocation(target)
            .scale(0.5)
            .delay(1250)
            .waitUntilFinished(-800);
    }
}
sequence.play();
