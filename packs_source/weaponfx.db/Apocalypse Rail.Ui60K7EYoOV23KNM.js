const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

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
    .atLocation(sourceToken)
    .stretchTo(target)
    .scale(2.0)
    .waitUntilFinished(-300);

    sequence.effect()
    .file("jb2a.fireball.explosion.orange")
    .atLocation(target)
    .zIndex(1)

    .sound()
    .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    ;

sequence.play();
