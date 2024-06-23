const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const random = Sequencer.Helpers.random_float_between(200, 300);

await Sequencer.Preloader.preloadForClients(["modules/lancer-weapon-fx/soundfx/Laser_Fire.ogg", "jb2a.impact.blue.2", "jb2a.lasershot.blue"])

let sequence = new Sequence();

for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];
	sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Laser_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
		.duration(633)
        .repeats(3, random);
	sequence.effect()
        .file("jb2a.impact.blue.2")
		.playIf(!targetsMissed.has(target.id))
        .atLocation(`impact${i}`)
        .scaleToObject(2)
        .repeats(3, random)
		.delay(300);
    sequence.effect()
        .file("jb2a.lasershot.blue")
        .atLocation(sourceToken)
        .stretchTo(target, {randomOffset: 0.4})
        .missed(targetsMissed.has(target.id))
	    .name(`impact${i}`)
        .repeats(3, random)
		.waitUntilFinished();
}
sequence.play();
