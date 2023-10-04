let target = Array.from(game.user.targets)[0];
const random = Sequencer.Helpers.random_float_between(200, 300);

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.effect()
        .file("jb2a.lasershot.blue")
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target, {randomOffset: 0.4})
        .repeats(4, random);

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Laser_Fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .repeats(4, random);
    sequence.effect()
        .file("jb2a.impact.blue.2")
        .atLocation(target, {randomOffset: 0.4})
        .scale(0.8)
        .delay(250)
        .repeats(4, random)
        .waitUntilFinished(-1000);
}
sequence.play();
