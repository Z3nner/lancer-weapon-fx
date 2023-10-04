let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.lasersword.melee.blue")
        .scale(1.1)
        .atLocation(canvas.tokens.controlled[0])
        .moveTowards(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .delay(900)
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
        .delay(1200)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.blue.3")
        .scale(1.2)
        .atLocation(target)
        .delay(1200)
    .waitUntilFinished(-900)
}
    sequence.play();