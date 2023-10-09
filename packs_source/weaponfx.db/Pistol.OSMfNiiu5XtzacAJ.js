let target = Array.from(game.user.targets)[0];
const random = Sequencer.Helpers.random_float_between(200, 500);

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/pistol_fire.ogg")
        .repeats(3, random)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.bullet.01.orange")
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .scale(0.5)
        .stretchTo(target, {randomOffset: 0.4})
        .repeats(3, random)
        .waitUntilFinished(-600);
}
sequence.play();
