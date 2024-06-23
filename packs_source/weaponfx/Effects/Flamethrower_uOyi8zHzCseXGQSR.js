const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients([
    "jb2a.burning_hands.01.orange",
    "modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg",
    "jb2a.flames.02.orange",
]);

let sequence = new Sequence()

    .effect()
    .file("jb2a.burning_hands.01.orange")
    .atLocation(sourceToken)
    .rotateTowards(target)
    .scale({ x: 0.75, y: 1.0 })
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .waitUntilFinished(-3000);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
            .file("jb2a.flames.02.orange")
            .opacity(0.7)
            .fadeIn(800)
            .fadeOut(800)
            .atLocation(target)
            .scaleToObject(1.2);
    }
}
sequence.play();
