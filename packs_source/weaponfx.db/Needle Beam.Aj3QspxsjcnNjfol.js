let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(0.5)
        .waitUntilFinished(-1200)
   sequence.effect()
        .file("jb2a.lasershot.green") 
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
        .repeats(2, 300)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
        .volume(0.5)
        .repeats(2, 300)
    sequence.effect()
        .file("jb2a.impact.orange.0")
        .atLocation(target)
        .rotateTowards(canvas.tokens.controlled[0])
        .rotate(230)
        .center()
    .waitUntilFinished()
        .tint("#1aff34")
        .scale(0.8)
        .delay(400)
   .waitUntilFinished(-1800)
}
    sequence.play();