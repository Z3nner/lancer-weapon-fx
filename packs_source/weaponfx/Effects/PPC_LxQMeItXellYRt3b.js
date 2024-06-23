const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/PPC2.ogg",
    "jb2a.chain_lightning.primary.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/PPC2.ogg")
        .delay(400)
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .effect()
        .file("jb2a.chain_lightning.primary.blue")
        .scale(0.7)
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));
}
sequence.play();
