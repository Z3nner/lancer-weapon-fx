let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()
    .effect()
    .file("jb2a.fire_jet.orange")
    .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
    .stretchTo(target)
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .play();
