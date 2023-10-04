let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/RetortLoop.ogg")
        .volume(0.8 * game.settings.get("lancer-weapon-fx", "volume"));
    sequence.effect()
        .file("jb2a.energy_beam.normal.bluepink.02")
        .scale(0.7)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target)
        .delay(200);
    sequence.effect()
        .file("jb2a.impact.blue")
        .scale(0.3)
        .atLocation(target, {randomOffset: 0.9})
        .repeats(8, 300)
        .delay(500);
}
sequence.play();
