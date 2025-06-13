const { targetTokens } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/LockOn.ogg",
    "jb2a.zoning.inward.square.loop.bluegreen.01.01",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    let targetOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, tokenHeightPercent: 0.0 });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/LockOn.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
    sequence
        .effect()
            .file("jb2a.zoning.inward.square.loop.bluegreen.01.01")
            .atLocation(target, targetOffset)
            .xray()
            .belowTokens()
            .scaleToObject(1.6);
}

sequence.play();
