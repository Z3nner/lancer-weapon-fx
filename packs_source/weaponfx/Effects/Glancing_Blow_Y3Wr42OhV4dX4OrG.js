const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/advisories/GlancingBlow.svg",
    "modules/lancer-weapon-fx/soundfx/ricochet.ogg",
    "jb2a.impact.005.orange",
]);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

new Sequence()

    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("modules/lancer-weapon-fx/advisories/GlancingBlow.svg")
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner" })
        .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .duration(5000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })
        .waitUntilFinished(-4500)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/ricochet.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.4))
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .rotate(90)
        .scaleToObject(1.6)
        .opacity(0.8)
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.impact.005.orange")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .rotate(270)
        .scaleToObject(1.6)
        .belowTokens()
        .opacity(0.8)

    .play();
