let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .waitUntilFinished()

    sequence.effect()
        .file("jb2a.impact.orange.0") 
        .atLocation(target, {randomOffset: 0.7})        
        .rotateTowards(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .repeats(3, 100)
        .rotate(230)
        .center()
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    .waitUntilFinished(-400)
}
    sequence.play();