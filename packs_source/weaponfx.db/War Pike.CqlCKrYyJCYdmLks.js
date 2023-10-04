let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()

  for(let target of Array.from(game.user.targets)){
    sequence.effect()
        .file("jb2a.spear.melee.01.white.2")
        .filter("Glow", {color: 0x8D918D})
        .scale(0.8)
        .atLocation(canvas.tokens.controlled[0])
        .moveTowards(target)
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
        .delay(1000)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
        .delay(1150)
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
    sequence.effect()
        .file("jb2a.impact.orange.3")
        .scale(0.8)
        .atLocation(target)
        .delay(1100)
    .waitUntilFinished()
}
    sequence.play();