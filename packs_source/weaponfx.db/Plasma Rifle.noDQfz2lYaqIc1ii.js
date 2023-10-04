let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.lasershot.green") 
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target, {randomOffset: 0.4})
        .repeats(3, 300)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .repeats(3, 300)
    sequence.effect()
        .file("jb2a.impact.004.blue")
        .atLocation(target, {randomOffset: 0.4})
        .tint("#1aff34")
        .scale(0.6)
        .repeats(3, 300)
        .delay(400)
   .waitUntilFinished(-1800)
}
    sequence.play();