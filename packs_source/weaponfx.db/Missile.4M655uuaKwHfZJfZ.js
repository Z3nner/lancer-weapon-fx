let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(0.5)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(0.5)
    sequence.effect()
        .file("modules/animated-spell-effects/spell-effects/air/black_smoke_RAY_01.webm") 
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
        .scale({ x: 1.0, y: .5 })
        .waitUntilFinished(-3700)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .volume(0.5)
    sequence.effect()
       .file("jb2a.explosion.01.orange")
       .atLocation(target)
       .scale(1.3)
       .zIndex(1)
       .waitUntilFinished(-1200)
  }
    sequence.play();