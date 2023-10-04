let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/ArcBowFire.ogg")
        .delay(800)
        .volume(0.5)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
        .delay(1200)
        .volume(0.5)
    sequence.effect()
        .file("jb2a.arrow.physical.blue")
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
    sequence.effect()
        .file("jb2a.lightning_bolt.narrow.blue")
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
        .delay(800)

}
    sequence.play();