let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/CPR_Fire.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .repeats(5, 125)

    sequence.effect()
        .file("jb2a.magic_missile.purple")
        .filter("ColorMatrix", { hue: 220})
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target, { randomOffset: 0.4 })
        .repeats(5, 125)
        .waitUntilFinished(-1600)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/CPR_Impact.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .repeats(5, 125)
    .waitUntilFinished
}
    sequence.play();