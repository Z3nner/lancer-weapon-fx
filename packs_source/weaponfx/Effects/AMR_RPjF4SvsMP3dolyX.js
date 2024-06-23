const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/WeaponClick.ogg",
    "modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg",
    "jb2a.bullet.Snipe.blue",
    "modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/WeaponClick.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished(200)
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/AMR_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .effect()
        .file("jb2a.bullet.Snipe.blue")
        .filter("ColorMatrix", { hue: 200 })
        .atLocation(sourceToken)
        .stretchTo(target)
        .missed(targetsMissed.has(target.id));
    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
            .file("modules/lancer-weapon-fx/soundfx/AMR_Impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .delay(75);
        sequence
            .effect()
            .file("jb2a.impact.orange.0")
            .atLocation(target)
            .rotateTowards(sourceToken)
            .rotate(230)
            .center()
            .delay(75)
            .waitUntilFinished();
    }
}
sequence.play();
