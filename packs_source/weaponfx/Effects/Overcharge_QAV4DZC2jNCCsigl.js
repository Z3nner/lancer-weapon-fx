const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// if overcharge is not a number, it will be 0
const overcharge = sourceToken.actor.system.overcharge || 0;

let svgFile;
let overchageShake = 0;
if (overcharge === 0 || overcharge === 1) {
    svgFile = "modules/lancer-weapon-fx/advisories/OverchargeYellow.svg";
} else if (overcharge === 2) {
    svgFile = "modules/lancer-weapon-fx/advisories/OverchargeOrange.svg";
} else {
    overchageShake = 1;
    svgFile = "modules/lancer-weapon-fx/advisories/OverchargeRed.svg";
}

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

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
        .loopProperty("sprite", "position.x", { from: -overchageShake, to: overchageShake, duration: 40, pingPong: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .scaleOut(0.01, 900)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .aboveInterface()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .duration(4000)
        .fadeIn(400)
        .fadeOut(800);
if (overcharge === 3) {
    sequence
        .effect()
            .file(svgFile)
            .attachTo(sourceToken, { align: "bottom-left", edge: "inner", offset: { x: -0.07, y: -0.07 }, gridUnits: true })
            .loopProperty("sprite", "position.x", { from: -1, to: 1, duration: 40, pingPong: true })
            .filter("Blur", { blurX: 30, blurY: 5 })
            .scaleIn(0.01, 500)
            .scale(0.09)
            .scaleOut(0.01, 900)
            .filter("Glow", { distance: 2, color: 0x000000 })
            .aboveInterface()
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .xray()
            .duration(4000)
            .fadeIn(400)
            .fadeOut(800);
}
sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Overcharge.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(-2700)
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 2000,
            fadeInDuration: 500,
            fadeOutDuration: 1500,
            strength: 4 + overcharge * 2, // if overchange is not a number, it will be 0
            frequency: 10,
            rotation: false,
        }),
    )
    .effect()
        .file("jb2a.static_electricity.02.blue")
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(1.2)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
    .effect()
        .file("jb2a.template_circle.out_pulse.02.burst.bluewhite")
        .atLocation(sourceToken, heightOffset)
        .belowTokens()
        .xray()
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .playbackRate(1.3)
        .scaleToObject(2.0)
    .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(1.5)
        .opacity(0.8)
        .mask(sourceToken)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .delay(1500)
        .xray()
    .effect()
        .file("jb2a.smoke.plumes.01.grey")
        .atLocation(sourceToken, heightOffset)
        .opacity(0.29)
        .tint(0x33ddff)
        .filter("Glow", { color: 0x00a1e6 })
        .filter("Blur", { blur: 5 })
        .scaleToObject(2)
        .fadeIn(1500)
        .fadeOut(4700, { delay: -800 })
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .belowTokens()
    .play();
