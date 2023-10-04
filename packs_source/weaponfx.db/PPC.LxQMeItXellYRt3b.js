let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/PPC2.ogg")
        .delay(400)
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.chain_lightning.primary.blue")
        .scale(0.7)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target)
}
    sequence.play();