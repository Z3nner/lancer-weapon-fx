const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.sword.melee.01.white")
        .tint("#080303")
        .scale(0.8)
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .delay(900)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
            .delay(1000)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        sequence.effect()
            .file("jb2a.impact.blue")
            .scale(1.2)
            .atLocation(target)
            .delay(1000)
            .waitUntilFinished(-1500);
    }
}
sequence.play();
