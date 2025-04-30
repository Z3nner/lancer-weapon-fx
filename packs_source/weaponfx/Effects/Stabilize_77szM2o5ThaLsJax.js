const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Stabilize.ogg",
    "jb2a.healing_generic.400px.green",
    "modules/lancer-weapon-fx/advisories/Stabilize.svg",
    "jb2a.ui.heartbeat.01.green",
]);

let xOffset = 0.0; // default value for non-isometric
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    xOffset = 0.3; // 0.3 grid units
}

let sequence = new Sequence()
    .canvasPan()
        .shake({
        duration: 200,
        fadeInDuration: 100,
        //fadeOutDuration: 100,
        strength: 6, // increase strength with each iteration.
        frequency: 15,
        rotation: false,
    })
    .canvasPan()
        .shake({
        duration: 1500,
        fadeInDuration: 200,
        fadeOutDuration: 1300,
        strength: 4, // increase strength with each iteration.
        frequency: 2,
        rotation: false,
    })
    .delay(200)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
        .file("modules/lancer-weapon-fx/advisories/Stabilize.svg")
        .attachTo(sourceToken, { align: "bottom", edge: "outer", offset: { y: -0.2 }, gridUnits: true })
        .scale(0.09)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .duration(4000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
    .effect()
        .file("jb2a.healing_generic.400px.green")
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(2)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
    .effect()
        .file("jb2a.ui.heartbeat.01.green")
        .attachTo(sourceToken, { align: "bottom", edge: "outer", offset: { y: -1.2, x: xOffset }, gridUnits: true })
        .scale(0.4)
        .tint("0x1eff00")
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .playbackRate(1.8)
    //.spriteAnchor({ y: 1.05 })
    .waitUntilFinished(-500)
    .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
    .xray()
    .effect()
        .file("jb2a.ui.heartbeat.01.green")
        .attachTo(sourceToken, { align: "bottom", edge: "outer", offset: { y: -1.2, x: xOffset }, gridUnits: true })
        .scale(0.4)
    //.rotate(180)
    .tint("0x1eff00")
    //.spriteOffset({ x: 0.5 }, { gridUnits: true })
    .filter("Glow", { distance: 2, color: 0x000000 })
    .aboveInterface()
    .playbackRate(1.8)
    //.spriteAnchor({ y: 0.1 })
    .mirrorX()
    .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
    .xray()

    .play();
