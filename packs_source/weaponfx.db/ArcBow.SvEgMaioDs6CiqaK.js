const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/ArcBowFire.ogg")
        .delay(800)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
        .delay(1200)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.arrow.physical.blue")
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));
    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.lightning_bolt.narrow.blue")
            .atLocation(sourceToken)
            .stretchTo(target)
            .delay(800);
    }
}
sequence.play();
