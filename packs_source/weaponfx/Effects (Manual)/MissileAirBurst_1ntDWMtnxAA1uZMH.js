const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// Calculate the point 70% of the distance between sourceToken and pTarget
const pBlast = {
    x: sourceToken.position.x + 0.6 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.6 * (pTarget.y - sourceToken.position.y),
};


let sequence = new Sequence()


    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000);
    sequence.effect()
        .file("jb2a.throwable.launch.missile")
        .scale(0.7)
        .from(sourceToken)
        .stretchTo(pBlast)
        .waitUntilFinished(-200)
    .effect()
         .file("jb2a.explosion.08")
         .atLocation(pBlast)
         .name("impact")
         .scale(0.8)
         .zIndex(1)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))

for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    sequence.effect()
        .file("jb2a.bullet.02.orange")
	.playIf(!targetsMissed.has(target.id))
         .scale(0.5)
	 .atLocation(pBlast)
	 .stretchTo(target)
    .effect()
        .file("jb2a.explosion_side.01")
	.playIf(!targetsMissed.has(target.id))
        .atLocation(target)
	.rotateTowards(pBlast)
	.center()
        .delay(350)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
	.delay(350);
}
sequence.play();
