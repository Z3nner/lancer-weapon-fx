let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/mix/fire_earth_explosion_SQUARE_02.webm")
        .atLocation(canvas.tokens.controlled[0])
        .rotateTowards(target)
        .scale(0.5)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Mortar_Launch.ogg")
        .volume(0.5)
    sequence.effect()
       .file("jb2a.explosion.03.blueyellow")
        .atLocation(target, {randomOffset: true})
        .repeats (3, 125)
        .delay(900)
     sequence.sound()
       .file("modules/lancer-weapon-fx/soundfx/Mortar_Impact.ogg")
       .volume(0.5)
       .delay(900)
}
    sequence.play();