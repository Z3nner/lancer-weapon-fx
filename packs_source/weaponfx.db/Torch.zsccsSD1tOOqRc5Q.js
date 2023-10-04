let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.greataxe.melee.standard.white")
        .tint("#c91af9")
        .scale(0.8)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .delay(1300)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_Hit.ogg")
        .delay(1550)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.blue.3")
        .scale(1.2)
        .tint("#c91af9")
        .atLocation(target)
        .delay(1550)
    .waitUntilFinished(-1000)
}
    sequence.play();