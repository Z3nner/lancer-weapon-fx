let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){

    sequence.effect()
        .file("jb2a.claws.400px.red")
        .tint("#720d87")
        .scale(0.8)
        .atLocation(target)
    sequence.sound()
       .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
       .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
       .repeats(2, 200)
    sequence.effect()
        .file("jb2a.impact.blue.2")
        .scale(1.5)
        .tint("#c91af9")
        .atLocation(target)
        .delay(600)
   .waitUntilFinished(-1000)
}
    sequence.play();