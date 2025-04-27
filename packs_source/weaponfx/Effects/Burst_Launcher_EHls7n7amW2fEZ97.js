const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = targetTokens[0];

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg",
    "jb2a.lightning_ball.blue",
    "modules/lancer-weapon-fx/soundfx/AirBurst.ogg",
    "jb2a.explosion.02.blue",
]);

const targetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
const moveTowardsOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), moveTowards: true });

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Autopod_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
    .effect()
        .file("jb2a.lightning_ball.blue")
        .endTime(1500)
        .scale(0.2)
        .atLocation(sourceToken, heightOffset)
        .moveTowards(moveTowardsOffset, { rotate: false })
        .isometric({ overlay: true })
        .missed(targetsMissed.has(target.id))
        .aboveInterface()
        .xray()
        .waitUntilFinished();

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/AirBurst.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("jb2a.explosion.02.blue")
        .playIf(!targetsMissed.has(target.id))
        .scale(0.5)
        .atLocation(target, targetHeightOffset)
        .aboveInterface()
        .isometric({ overlay: true })
        .xray()
        .waitUntilFinished();

sequence.play();
