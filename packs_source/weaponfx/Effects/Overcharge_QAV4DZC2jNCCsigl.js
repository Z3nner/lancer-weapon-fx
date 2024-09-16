const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

const overcharge = sourceToken.actor.system.overcharge;

let svgFile;
if (overcharge === 0 || overcharge === 1) {
    svgFile = "modules/lancer-weapon-fx/advisories/OverchargeYellow.svg";
} else if (overcharge === 2) {
    svgFile = "modules/lancer-weapon-fx/advisories/OverchargeOrange.svg";
} else {
    svgFile = "modules/lancer-weapon-fx/advisories/OverchargeRed.svg";
}

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Overcharge.ogg",
    "jb2a.static_electricity.02.blue",
    "jb2a.template_circle.out_pulse.02.burst.bluewhite",
    "jb2a.static_electricity.03",
    "jb2a.smoke.plumes.01.grey",
    svgFile,
]);

let sequence = new Sequence()
    .effect()
        .file(svgFile)
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner", offset: { x: -0.07, y: -0.07 }, gridUnits: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .scaleOut(0.01, 900)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .duration(4000)
        .fadeIn(400)
        .fadeOut(800)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Overcharge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-2700)
    .effect()
        .file("jb2a.static_electricity.02.blue")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .scaleToObject(1.2)
        .randomSpriteRotation()
    .effect()
        .file("jb2a.template_circle.out_pulse.02.burst.bluewhite")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .belowTokens()
        .playbackRate(1.3)
        .scaleToObject(2.0)
    .effect()
        .file("jb2a.static_electricity.03")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .scaleToObject(1)
        .opacity(0.8)
        .mask(sourceToken)
        .delay(1500)
    .effect()
        .file("jb2a.smoke.plumes.01.grey")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty } })
        .opacity(0.29)
        .tint(0x33ddff)
        .filter("Glow", { color: 0x00a1e6 })
        .filter("Blur", { blur: 5 })
        .scaleToObject(2)
        .fadeIn(1500)
        .fadeOut(4700, { delay: -800 })
        .rotate(-35)
        .belowTokens()
    .play();
