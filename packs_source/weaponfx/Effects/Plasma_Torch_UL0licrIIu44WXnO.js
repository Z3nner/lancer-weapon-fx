const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const target = targetTokens[0];

// the calculated height of the targeted token (including scaling & elevation)
const targetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

await Sequencer.Preloader.preloadForClients([
    "jb2a.fire_jet.orange",
    "modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg",
]);

let sequence = new Sequence()
    .effect()
        .file("jb2a.fire_jet.orange")
        .filter("ColorMatrix", { hue: 210 })
        .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
        .atLocation(sourceToken, heightOffset)
        .aboveInterface()
        .xray()
        .stretchTo(target, targetHeightOffset)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .play();
