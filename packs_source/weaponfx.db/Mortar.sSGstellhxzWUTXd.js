const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/mix/fire_earth_explosion_SQUARE_02.webm")
        .atLocation(sourceToken)
        .rotateTowards(target)
        .missed(targetsMissed.has(target.id))
        .scale(0.5);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.explosion.03.blueyellow")
        .atLocation(target, {randomOffset: true})
        .missed(targetsMissed.has(target.id))
        .repeats(3, 125)
        .delay(900);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .delay(900);
}
sequence.play();
