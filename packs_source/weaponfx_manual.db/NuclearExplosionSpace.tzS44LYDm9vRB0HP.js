new Sequence()
	.effect("modules/lancer-weapon-fx/sprites/jetlancer_explosion_white_bg.png")
		.fadeIn(100)
		.duration(6000)
		.fadeOut(3000)
		.screenSpace()
	.effect("modules/lancer-weapon-fx/sprites/shockwave.png")
		.atLocation(token)
		.duration(7000)
		.scale(0.2)
		.scaleOut(12, 7000)
		.fadeOut(7000)
		.delay(3000)
	.sound("modules/lancer-weapon-fx/soundfx/pw_nuke.ogg")
		.startTime(800)
		.delay(1000)
	.effect("modules/lancer-weapon-fx/video/pw_nuke_effect.webm")
		.delay(1000)
		.atLocation(token)
		.aboveLighting()
		.xray()
		.scale(1)
		.zIndex(100)
		.thenDo(remainsAftermath)
	.canvasPan()
		.delay(1000)
        .atLocation(token)
        .scale(0.5)
		.shake({
			duration: 20000,
			strength: 15,
			fadeOutDuration: 10000,
			rotation: true
		})
.play()

async function remainsAftermath() {
	console.log("AFTERMATH");
	token.document.update({hidden: true});
}

async function createLight() {
	await canvas.scene.createEmbeddedDocuments("AmbientLight", [{
		x: token.document.x + (canvas.dimensions.size / 2),
		y: token.document.y +  (canvas.dimensions.size / 2),
		config: {
			color: "#ff9117",
			dim: 10,
			bright: 5,
			animation: {
				type: "pulse",
			},
		}
	}]);
}