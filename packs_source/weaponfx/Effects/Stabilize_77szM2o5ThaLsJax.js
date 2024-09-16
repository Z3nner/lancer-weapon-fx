const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Stabilize.ogg",
    "jb2a.healing_generic.400px.green",
    "modules/lancer-weapon-fx/advisories/Stabilize.svg",
    "jb2a.ui.heartbeat.01.green",
]);

let sequence = new Sequence()

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
    .effect()
        .file("jb2a.healing_generic.400px.green")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .scaleToObject(1.7)
    .effect()
        .file("jb2a.ui.heartbeat.01.green")
        .attachTo(sourceToken, { align: "bottom", edge: "outer" })
        .scale(0.4)
        .tint("0x1eff00")
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .playbackRate(1.8)
        .spriteAnchor({ y: 1.05 })
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.ui.heartbeat.01.green")
        .attachTo(sourceToken, { align: "bottom", edge: "outer" })
        .scale(0.4)
        .rotate(180)
        .tint("0x1eff00")
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .playbackRate(1.8)
        .spriteAnchor({ y: 0.1 })

    .play();
