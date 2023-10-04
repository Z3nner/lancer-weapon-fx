let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()
    .effect()
        .file("jb2a.fire_jet.orange")
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    .play();