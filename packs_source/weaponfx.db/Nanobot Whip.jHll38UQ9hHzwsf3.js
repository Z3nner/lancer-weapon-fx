const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.divine_smite.target.blueyellow")
        .scale(0.8)
        .tint("#066605")
        .atLocation(sourceToken)
        .rotateTowards(target)
        .missed(targetsMissed.has(target.id))
        .spriteOffset({x: -160 * gridscale, y: 90 * gridscale})
        .rotate(90);

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
            .delay(300)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        sequence.effect()
            .file("jb2a.impact.blue")
            .scale(0.4)
            .tint("#066605")
            .atLocation(target, {randomOffset: 1})
            .repeats(4, 80)
            .delay(700)
            .waitUntilFinished(-1500);
    }
}
sequence.play();
