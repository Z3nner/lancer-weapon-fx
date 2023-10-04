let target = Array.from(game.user.targets)[0];
let sequence = new Sequence()

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

   for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("modules/lancer-weapon-fx/sprites/DRILL.png")
        .scale(0.6)

        .filter("Glow", { color: 0xd7d23c })
        .atLocation(canvas.tokens.controlled[0])
        .spriteOffset({x: -10 * gridscale, y:10 * gridscale})
        .moveTowards(target)
        .moveSpeed(100)
        .rotate(140)

    sequence.effect()
        .file("jb2a.gust_of_wind.veryfast")
        .scale(0.2)
        .atLocation(canvas.tokens.controlled[0])
        .moveTowards(target)
        .zIndex(2)
        .delay(50)

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
        .repeats(8, 125)
        .delay(200)
    sequence.effect()
        .file("jb2a.impact.yellow")
        .scale(.4)
        .delay(200)
        .zIndex(1)
        .atLocation(target, {randomOffset: 0.4})
        .repeats(8, 125)
      .waitUntilFinished()
}
    sequence.play();