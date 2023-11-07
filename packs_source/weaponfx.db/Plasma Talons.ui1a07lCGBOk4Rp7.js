const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {

    sequence.effect()
        .file("jb2a.claws.400px.red")
        .tint("#720d87")
        .scale(0.8)
        .atLocation(target)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(2, 200);
    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.impact.blue.2")
            .scale(1.5)
            .tint("#c91af9")
            .atLocation(target)
            .delay(600)
            .waitUntilFinished(-1000);
    }
}
sequence.play();
