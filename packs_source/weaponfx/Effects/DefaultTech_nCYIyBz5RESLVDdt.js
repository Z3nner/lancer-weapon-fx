const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

targetTokens.forEach(target => {
    let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/TechPrepare.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))

    .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.02")
        .scaleToObject(2.5)
        .filter("Glow", {color: 0x36c11a})
        .playbackRate(1.3)
        .atLocation(sourceToken)
	    .waitUntilFinished(-400)

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/TechWarn.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
		
    .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.02")
        .scaleToObject()
        .repeats (3, 75)
        .playbackRate(1.5)
        .atLocation(target, {randomOffset: 0.7, gridUnits: true})
        .filter("Glow", {color: 0x36c11a})
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished()		

        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .playIf(!targetsMissed.has(target.id))
       .effect()
            .file("jb2a.zoning.inward.circle.loop")
	    .playIf(!targetsMissed.has(target.id))
            .scale(0.4)
            .fadeOut(3800, {ease: "easeOutBack"})
            .belowTokens()
            .atLocation(target)
            .waitUntilFinished(-2200)
       .effect()
            .file("jb2a.static_electricity")
            .scaleToObject(1.1)
            .atLocation(target)
            .playIf(!targetsMissed.has(target.id))

    sequence.play();
	});
