const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Flechette.ogg",
    "jb2a.explosion.04.blue",
    "jb2a.impact.yellow",
]);

let sequence = new Sequence()

    .sound()
    .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
    .file("jb2a.explosion.04.blue")
    .playbackRate(2)
    .atLocation(sourceToken)
    .waitUntilFinished()
    .effect()
    .file("jb2a.impact.yellow")
    .scale(0.5)
    .repeats(6, 20)
    .atLocation(sourceToken, { randomOffset: 2.2, gridUnits: true })
    .play();
