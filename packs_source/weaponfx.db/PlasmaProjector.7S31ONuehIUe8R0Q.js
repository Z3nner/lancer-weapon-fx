const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];

new Sequence()

    .canvasPan()
        .duration(1000)
        .atLocation(sourceToken)
        .scale(0.25)
    .effect()
        .file("jb2a.disintegrate.green")
        .delay(1000)
        .startTime(1)
        .scale(2)
        .playbackRate(0.6)
        .filter("Glow", {distance: 3, color: 0x98ec5f, innerStrength: 2})
        .atLocation(sourceToken)
        .stretchTo(target)
        .waitUntilFinished(-3400)
    .canvasPan()
	.duration(2000)
        .atLocation(target)
        .scale(0.4)
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.impact.blue")
        .filter("ColorMatrix", {hue: 270})
        .scaleToObject()
        .atLocation(target, {randomOffset: 1.2, gridUnits: true})
        .repeats(10, 200, 700)
        .waitUntilFinished(-500)
	.effect("modules/lancer-weapon-fx/sprites/jetlancer_explosion_white_bg.png")
		.fadeIn(100)
		.duration(6000)
		.fadeOut(3000)
		.screenSpace()
	.effect("modules/lancer-weapon-fx/sprites/shockwave.png")
		.atLocation(target)
        .filter("ColorMatrix", {hue: 090})
		.duration(7000)
		.scale(0.2)
		.scaleOut(12, 7000)
		.fadeOut(7000)
		.delay(3000)
	.sound("modules/lancer-weapon-fx/soundfx/pw_nuke.ogg")
		.startTime(800)
		.delay(1000)
	.effect("modules/lancer-weapon-fx/video/pw_nuke_effect.webm")
        .filter("ColorMatrix", {hue: 090})
		.delay(1000)
		.atLocation(target)
		.aboveLighting()
		.xray()
		.scale(1)
		.zIndex(100)
		.thenDo(remainsAftermath)
	.canvasPan()
		.delay(1000)
        .atLocation(target)
        .scale(0.5)
		.shake({
			duration: 20000,
			strength: 15,
			fadeOutDuration: 10000,
			rotation: true
		})

.play();

function remainsAftermath() {
	console.log("AFTERMATH");
	targetTokens[0].document.update({hidden: true});
}