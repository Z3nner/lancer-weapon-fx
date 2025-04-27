const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: sourceToken, tokenHeightPercent: 0.0 });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/TechPrepare.ogg",
    "jb2a.extras.tmfx.outpulse.circle.02.normal",
    "modules/lancer-weapon-fx/soundfx/TechWarn.ogg",
    "jb2a.extras.tmfx.inpulse.circle.02.normal",
    "modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg",
    "jb2a.zoning.inward.circle.loop.bluegreen.01.01",
    "jb2a.static_electricity.03.blue",
]);

targetTokens.forEach(async target => {
    let sequence = new Sequence();

    const targetHeightOffsetFloor = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({
            targetToken: target,
            tokenHeightPercent: 0.0,
            missed: targetsMissed.has(target.id),
        });
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.7, missed: targetsMissed.has(target.id) });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/TechPrepare.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .effect()
            .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
            .scaleToObject(2.5)
            .filter("Glow", { color: 0x36c11a })
            .playbackRate(1.3)
            .atLocation(sourceToken, heightOffset)
            .waitUntilFinished(-400)
            .belowTokens()
            .xray()

        .sound()
            .file("modules/lancer-weapon-fx/soundfx/TechWarn.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .effect()
            .file("jb2a.extras.tmfx.inpulse.circle.02.normal")
            .scaleToObject()
            .repeats(3, 75)
            .playbackRate(1.5)
            .atLocation(target, targetHeightOffsetRand)
            .filter("Glow", { color: 0x36c11a })
            .missed(targetsMissed.has(target.id))
            .waitUntilFinished()
            .aboveInterface()
            .xray();

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .playIf(!targetsMissed.has(target.id))
        .effect()
            .file("jb2a.zoning.inward.circle.loop.bluegreen.01.01")
            .playIf(!targetsMissed.has(target.id))
            .scale(0.4)
            .fadeOut(3800, { ease: "easeOutBack" })
            .belowTokens()
            .xray()
            .atLocation(target, targetHeightOffsetFloor)
            .waitUntilFinished(-2200)
        .effect()
            .file("jb2a.static_electricity.03.blue")
            .scaleToObject(1.1)
            .atLocation(target, targetHeightOffsetRand)
            .repeats(3, 200)
            .isometric({ overlay: true })
            .playIf(!targetsMissed.has(target.id))
            .xray();

    sequence.play();
});
