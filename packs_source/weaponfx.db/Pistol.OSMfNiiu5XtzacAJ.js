const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const random = Sequencer.Helpers.random_float_between(200, 500);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/pistol_fire.ogg")
        .repeats(3, random)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .scale(0.5)
        .stretchTo(target, {randomOffset: 0.4})
        .missed(targetsMissed.has(target.id))
        .repeats(3, random)
        .waitUntilFinished(-600);
}
sequence.play();
