let target = Array.from(game.user.targets)[0];

  let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/AR_Fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
      sequence.effect()
        .file("jb2a.bullet.01.orange") 
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target, {randomOffset: 0.4})
        .repeats(4, 100)
        .waitUntilFinished()
  }

  sequence.play();