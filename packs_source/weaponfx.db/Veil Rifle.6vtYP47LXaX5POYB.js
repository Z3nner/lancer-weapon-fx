const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.bullet.Snipe.blue")
        .filter("ColorMatrix", {hue: 60})
        .filter("Glow", {distance: 3})
        .atLocation(sourceToken)
        .scale(0.8)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
}
sequence.play();