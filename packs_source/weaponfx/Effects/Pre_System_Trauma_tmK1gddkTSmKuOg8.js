const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/advisories/SystemTrauma.svg",
    "jb2a.static_electricity.03.blue",
]);

new Sequence()

    .effect()
        .file("modules/lancer-weapon-fx/advisories/SystemTrauma.svg")
        .attachTo(sourceToken, { align: "bottom-left", edge: "inner" })
        .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 3500, gridUnits: true, fromEnd: true })
        .scaleIn(0.01, 500)
        .scale(0.09)
        .filter("Glow", { distance: 2, color: 0x000000 })
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .aboveInterface()
        .duration(5000)
        .fadeIn(400)
        .fadeOut(800, { delay: -1200 })

    .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(sourceToken, heightOffset)
        .scaleToObject(1.1)
        .randomSpriteRotation()
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .repeats(2, 2600)
        .mask(sourceToken)

    .play();
