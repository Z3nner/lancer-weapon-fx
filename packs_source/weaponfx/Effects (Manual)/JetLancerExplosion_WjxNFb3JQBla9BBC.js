const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg",
    "modules/lancer-weapon-fx/soundfx/jetlancerSound.ogg",
    "modules/lancer-weapon-fx/video/jetlancer_explosion_1000.webm",
    "modules/lancer-weapon-fx/sprites/jetlancer_explosion_white_bg.png",
    "modules/lancer-weapon-fx/sprites/RETROGRADE-crater.png",
]);

let sequence = new Sequence();

new Sequence()

    .sound("modules/lancer-weapon-fx/soundfx/dramaticSparkles.ogg")
    .fadeInAudio(4000)
    .volume(0.3)
    .duration(5000)
    .effect("jb2a.static_electricity.03.blue")
    .atLocation(sourceToken)
    .scaleToObject(1)
    .duration(5000)
    .canvasPan()
    .atLocation(sourceToken)
    .duration(5000)
    .scale(1)
    .waitUntilFinished()
    .canvasPan()
    .atLocation(sourceToken)
    .duration(100)
    .scale(2)
    .sound("modules/lancer-weapon-fx/soundfx/jetlancerSound.ogg")
    .effect("modules/lancer-weapon-fx/video/jetlancer_explosion_1000.webm")
    .aboveInterface()
    .atLocation(sourceToken)
    .scale(1)
    .canvasPan()
    .shake({ duration: 5000, strength: 10, rotation: false, fadeOutDuration: 500 })
    .thenDo(remainsAftermath)
    .waitUntilFinished()
    .effect("modules/lancer-weapon-fx/sprites/jetlancer_explosion_white_bg.png")
    .delay(3600)
    .aboveInterface()
    .atLocation(sourceToken)
    .duration(1700)
    .fadeOut(300)
    .play();

function remainsAftermath() {
    console.log("AFTERMATH");
    console.log(sourceToken);
    console.log(canvas);
    token.document.update({ hidden: true });
    canvas.scene.createEmbeddedDocuments("Tile", [
        {
            texture: { src: "modules/lancer-weapon-fx/sprites/RETROGRADE-crater.png" },
            x: token.document.x - canvas.dimensions.size,
            y: token.document.y - (canvas.dimensions.size + canvas.dimensions.size / 2),
            height: canvas.dimensions.size * (token.document.width + 2),
            width: canvas.dimensions.size * (token.document.width + 2),
            tint: "#464646",
        },
    ]);
}

sequence.play();
