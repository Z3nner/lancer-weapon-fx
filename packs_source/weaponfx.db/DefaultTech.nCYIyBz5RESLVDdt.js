const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

targetTokens.forEach(target => {
    let sequence = new Sequence()

        .sound()
        .file("modules/lancer-weapon-fx/soundfx/Nexus_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
        .effect()
        .file("jb2a.energy_strands.range.multiple.purple.01.30ft")
        .scale(1.4)
        .playbackRate(1.5)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-800);

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
            .file("modules/lancer-weapon-fx/soundfx/PPC2.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .effect()
            .file("jb2a.static_electricity.02.blue")
            .scale(0.5)
            .atLocation(target)
            .waitUntilFinished()
    }

    sequence.play();
});
