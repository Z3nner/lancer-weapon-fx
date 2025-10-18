const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = targetTokens[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg",
    "jb2a.lightning_ball.blue",
    "modules/lancer-weapon-fx/soundfx/AirBurst.ogg",
    "jb2a.explosion.02.blue",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.lightning_ball.blue")
        .endTime(1500)
        .scale(0.2)
        .atLocation(sourceToken)
        .moveTowards(target)
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished();

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AirBurst.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.explosion.02.blue")
        .playIf(!targetsMissed.has(target.id))
        .scale(0.5)
        .atLocation(target)
        .waitUntilFinished();

sequence.play();
