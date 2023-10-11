const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const random = Sequencer.Helpers.random_float_between(200, 300);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.lasershot.blue")
        .atLocation(sourceToken)
        .stretchTo(target, {randomOffset: 0.4})
        .missed(targetsMissed.has(target.id))
        .repeats(4, random);

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Laser_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(4, random);

    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.impact.blue.2")
            .atLocation(target, {randomOffset: 0.4})
            .scale(0.8)
            .delay(250)
            .repeats(4, random)
            .waitUntilFinished(-1000);
    }
}
sequence.play();
