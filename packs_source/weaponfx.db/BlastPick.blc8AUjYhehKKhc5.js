const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();


for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.melee_generic.slash.01.orange")
        .scaleToObject(4)
        .atLocation(sourceToken)
        .spriteOffset({x: -1.5}, {gridUnits:true})
        .rotateTowards(target)
        .delay(500)
        .missed(targetsMissed.has(target.id))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .delay(500)
        .waitUntilFinished(-1300);
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        sequence.effect()
            .file("jb2a.explosion.01")
            .scale(1)
            .zIndex(2)
            .atLocation(target, {randomOffset: 0.5, gridUnits: true})
        sequence.effect()
            .file("jb2a.static_electricity.03.blue")
            .scale(0.4)
            .atLocation(target, {randomOffset: 1, gridUnits: true})
            .repeats(2, 80)
            .waitUntilFinished(-800);
    }
}
sequence.play();