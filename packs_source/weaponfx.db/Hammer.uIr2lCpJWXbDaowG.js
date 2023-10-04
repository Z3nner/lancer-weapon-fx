let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.warhammer.melee.01.white.4")
        .atLocation(canvas.tokens.controlled[0])
        .moveTowards(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .delay(1300)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/HammerImpact.ogg")
        .delay(1350)
        .volume(0.9 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.ground_crack.orange")
        .atLocation(target)
        .scale(0.5)
        .delay(1250)
    .waitUntilFinished(-800)
}
    sequence.play();