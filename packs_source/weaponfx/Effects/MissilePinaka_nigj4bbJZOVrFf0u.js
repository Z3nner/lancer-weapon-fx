const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// Pinaka wants 2 missiles, so get 2 groups
const targetPoints = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 2);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg",
    "modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg",
    "jb2a.throwable.launch.missile",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
    "jb2a.explosion.01.orange",
    "jb2a.explosion.08.orange",
]);

let sequence = new Sequence();

for (const targetPoint of targetPoints) {
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000);
    sequence
    .effect()
        .file("jb2a.throwable.launch.missile")
        .atLocation(sourceToken)
        .stretchTo(targetPoint)
        .waitUntilFinished();
    sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect().file("jb2a.explosion.01.orange").atLocation(targetPoint).scale(1.2).zIndex(2);
    sequence.effect().file("jb2a.explosion.08.orange").atLocation(targetPoint).scale(1.2).zIndex(1);
}
sequence.play();
