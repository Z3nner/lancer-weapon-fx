let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/shotgun_fire.ogg")
        .delay(200)
        .volume(0.5)
    sequence.effect()
        .file("jb2a.bolt.physical.orange")
        .atLocation(canvas.tokens.controlled[0])
		.startTime(500)
        .stretchTo(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .delay(700)
        .volume(0.5)
    sequence.effect()
        .file("jb2a.explosion.01.orange")
        .atLocation(target)
        .delay(700)
   .waitUntilFinished()
}
    sequence.play();