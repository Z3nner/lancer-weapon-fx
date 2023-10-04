let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .waitUntilFinished(-500)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.bullet.Snipe.blue")
        .atLocation(canvas.tokens.controlled[0])
        .stretchTo(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.orange.0") 
        .atLocation(target)
        .rotateTowards(canvas.tokens.controlled[0])
        .rotate(230)
        .center()
    .waitUntilFinished()
}
    sequence.play();