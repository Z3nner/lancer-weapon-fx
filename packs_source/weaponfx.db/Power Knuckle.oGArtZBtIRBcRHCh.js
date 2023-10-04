let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.unarmed_strike.physical.02.blue")
        .scale(0.9)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .moveTowards(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/knuckleswing.ogg")
        .delay(300)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/knucklehit.ogg")
        .delay(600)
        .volume(0.8 * game.settings.get("lancer-weapon-fx", "volume"))
   .waitUntilFinished(-100)
}
    sequence.play();