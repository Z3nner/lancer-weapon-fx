const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = targetTokens[0];

await Sequencer.Preloader.preloadForClients(["jb2a.fire_jet.orange", "modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg"])

let sequence = new Sequence()

    .effect()
        .file("jb2a.fire_jet.orange")
        .filter("ColorMatrix", {hue: 210})
        .filter("Glow", {distance: 3, color: 0xe99649, innerStrength: 2})
        .atLocation(sourceToken)
        .stretchTo(target)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .play();