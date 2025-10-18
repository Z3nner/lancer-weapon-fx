const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/APR2_Load.ogg",
    "modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg",
    "jb2a.bullet.01.orange",
    "jb2a.fireball.explosion.orange",
    "modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Load.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.bullet.01.orange")
        .atLocation(sourceToken)
        .stretchTo(target)
        .scale(2.0)
        .waitUntilFinished(-300);

sequence
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.fireball.explosion.orange")
        .atLocation(target)
        .zIndex(1)

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/APR2_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

sequence.play();
