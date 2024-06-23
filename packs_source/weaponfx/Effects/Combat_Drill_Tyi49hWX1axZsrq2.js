const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients(["modules/lancer-weapon-fx/sprites/DRILL.png", "modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg", "jb2a.gust_of_wind.veryfast", "jb2a.impact.yellow"])

let sequence = new Sequence();

let gridsize = canvas.grid.grid.options.dimensions.size;
let gridscale = gridsize / 100;

for (const target of targetTokens) {
    sequence.effect()
        .file("modules/lancer-weapon-fx/sprites/DRILL.png")
        .scale(0.6)
        .filter("Glow", {color: 0xd7d23c})
        .atLocation(sourceToken)
        .spriteOffset({x: -10 * gridscale, y: 10 * gridscale})
        .moveTowards(target)
	.missed(targetsMissed.has(target.id))
        .moveSpeed(100)
        .rotate(140)

    if (!targetsMissed.has(target.id)) {
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .repeats(8, 125)
            .delay(200)
        .effect()
            .file("jb2a.gust_of_wind.veryfast")
            .scale(0.2)
            .atLocation(sourceToken)
            .moveTowards(target)
		    .zIndex(2)
            .delay(50)
        .effect()
            .file("jb2a.impact.yellow")
            .scale(.4)
            .delay(200)
            .zIndex(1)
            .atLocation(target, {randomOffset: 0.4})
            .repeats(8, 125)
            .waitUntilFinished();
    }
	else {
	    sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Autopod_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .repeats(2, 170)
            .delay(200)
		}
}
sequence.play();
