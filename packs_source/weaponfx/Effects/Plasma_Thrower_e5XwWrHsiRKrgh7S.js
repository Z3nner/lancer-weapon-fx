const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg",
    "jb2a.breath_weapons02.burst.cone.fire.orange.02",
    "jb2a.flames.02.orange",
]);

let sequence = new Sequence();

sequence
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .effect()
    .file("jb2a.breath_weapons02.burst.cone.fire.orange.02")
    .atLocation(sourceToken)
    .filter("ColorMatrix", { hue: 270 })
    .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
    .scale({ x: 0.9 })
    .playbackRate(1.6)
    .rotateTowards(target)
    .waitUntilFinished(-3500);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
            .file("jb2a.flames.02.orange")
            .filter("ColorMatrix", { hue: 270 })
            .filter("Glow", { distance: 3, color: 0xe99649, innerStrength: 2 })
            .opacity(0.7)
            .fadeIn(800)
            .fadeOut(800)
            .atLocation(target)
            .scaleToObject(1.2);
    }
}
sequence.play();
