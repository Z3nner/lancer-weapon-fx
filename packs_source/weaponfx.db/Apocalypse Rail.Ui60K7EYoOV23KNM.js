let target = Array.from(game.user.targets)[0];

let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .waitUntilFinished()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
    .file("jb2a.bullet.01.orange")
    .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
    .stretchTo(target)
    .scale(2.0)
    .waitUntilFinished(-300)
    .effect()
    .file("jb2a.fireball.explosion.orange")
    .atLocation(target)
    .zIndex(1)
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .play();
