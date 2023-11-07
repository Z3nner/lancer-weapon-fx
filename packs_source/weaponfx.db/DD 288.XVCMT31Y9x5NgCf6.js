const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.unarmed_strike")
        .scale(0.8)
        .atLocation(sourceToken)
        .rotateTowards(target)
        .missed(targetsMissed.has(target.id))
        .spriteOffset({x: -170 * gridscale})
        .repeats(6, 200);

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .repeats(6, 300)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6));
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
            .delay(300)
            .repeats(5, 300)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
        sequence.effect()
            .file("jb2a.impact.blue")
            .scale(0.4)
            .atLocation(target, {randomOffset: 1})
            .repeats(4, 90)
            .delay(1900)
            .waitUntilFinished(-500);
    }
}
sequence.play();
