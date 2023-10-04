let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Fire.ogg")
        .delay(400)
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.fireball.beam.orange")
        .scale(1.25)
        .startTime(1500)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Thermal_Rifle_Hit.ogg")
        .delay(700)
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.orange.3")
        .atLocation(target)
        .delay(700)
   .waitUntilFinished()
}
    sequence.play();