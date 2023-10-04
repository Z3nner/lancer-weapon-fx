let target = Array.from(game.user.targets)[0];
let scale = target.actor.system.derived.mm.Size;
let sequence = new Sequence()

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.divine_smite.target.blueyellow")
        .scale(0.8)
        .atLocation(canvas.tokens.controlled[0])
        .rotateTowards(target)
        .spriteOffset({x: -160 * gridscale, y:90 * gridscale})
        .rotate(90)

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")

        .volume(0.7)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
        .delay(300)
        .volume(0.7)
    sequence.effect()
        .file("jb2a.impact.blue")
        .scale(0.4)
        .atLocation(target, {randomOffset: 1})
        .repeats (4, 80)
        .delay(700)
    .waitUntilFinished(-1500)
}
    sequence.play();