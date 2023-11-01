const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/AssaultCannonFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(target, {randomOffset: 0.3})
        .missed(targetsMissed.has(target.id))
        .repeats(7, 50)
        .scale(0.5)
        .waitUntilFinished();
}

sequence.play();
