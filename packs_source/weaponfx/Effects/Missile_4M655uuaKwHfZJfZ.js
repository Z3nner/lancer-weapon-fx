const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients(["modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg", "modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg", "jb2a.pack_hound_missile", "jb2a.explosion.01.orange", "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg"], showProgressBar = true)

let sequence = new Sequence()

    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000);
    sequence.effect()
        .file("jb2a.pack_hound_missile")
        .atLocation(sourceToken)
        .stretchTo(target)
        .waitUntilFinished(-3200);
    sequence.effect()
         .file("jb2a.explosion.01.orange")
         .atLocation(target)
         .scale(1.2)
         .zIndex(1)
         .waitUntilFinished(-1300);

    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

    }
sequence.play();
