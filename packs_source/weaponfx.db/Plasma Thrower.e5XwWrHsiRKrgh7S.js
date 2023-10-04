let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()
    .effect()
        .file("jb2a.breath_weapons02.burst.line.fire.orange.01")
        .atLocation(canvas.tokens.controlled[0])
        .rotateTowards(target)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(0.5)
    .play();