let target = Array.from(game.user.targets)[0];

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.unarmed_strike")
        .scale(0.8)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .rotateTowards(target)
        .spriteOffset({x: -170 * gridscale})
        .repeats (6, 200)

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .repeats (6, 300)
        .volume(0.6 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
        .delay(300)
        .repeats (5, 300)
        .volume(0.8 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.blue")
        .scale(0.4)
        .atLocation(target, {randomOffset: 1})
        .repeats (4, 90)
        .delay(1900)
    .waitUntilFinished(-500)
}
    sequence.play();