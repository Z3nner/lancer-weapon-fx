const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Annihilator_Charge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.eldritch_blast.purple")
        .startTime(900)
        .scale(.86)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id))
        .name("impact")
        .waitUntilFinished(-4000);
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
        sequence.effect()
            .file("jb2a.impact.blue.3")
            .scale(1.0)
            .tint("#c91af9")
            .atLocation(target)
            .waitUntilFinished(-400);
    } else {
		sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Annihilator.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
        sequence.effect()
            .file("jb2a.impact.blue.3")
            .scale(1.0)
            .tint("#c91af9")
            .atLocation("impact")
            .waitUntilFinished(-400);
	}	
}
sequence.play();