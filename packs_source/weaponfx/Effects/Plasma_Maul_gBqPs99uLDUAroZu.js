const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients(["jb2a.melee_attack.03.trail.maul.01", "modules/lancer-weapon-fx/soundfx/Axe_swing.ogg", "modules/lancer-weapon-fx/soundfx/HammerImpact.ogg", "jb2a.impact.ground_crack.orange.01"])

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.melee_attack.03.trail.maul.01")
        .filter("Glow", {color: 0x18f014, innerStrength: 1.5, knockout: false, quality: 0.1, distance: 50})
        .tint("#18f014")
        .atLocation(sourceToken)
        .spriteOffset({x: -0.3}, {gridUnits:true})
        .moveTowards(target)
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-1100);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Axe_swing.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
		.waitUntilFinished(-1800);
    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/HammerImpact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.9));
        sequence.effect()
            .file("jb2a.impact.ground_crack.orange.01")
	        .tint("#18f014")
            .atLocation(target)
            .belowTokens()
            .scaleToObject(3)
            .waitUntilFinished(-4000);
    }
}
sequence.play();