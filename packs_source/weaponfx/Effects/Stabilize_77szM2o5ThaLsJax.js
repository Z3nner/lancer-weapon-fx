const { sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Stabilize.ogg",
    "jb2a.healing_generic.400px.green",
]);

let sequence = new Sequence()

    .sound()
    .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
    .file("jb2a.healing_generic.400px.green")
    .atLocation(sourceToken)
    .play();
