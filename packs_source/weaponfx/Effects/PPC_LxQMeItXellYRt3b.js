const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/PPC2.ogg",
    "jb2a.chain_lightning.primary.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/PPC2.ogg")
            .delay(400)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
    sequence.canvasPan().shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 400,
            fadeInDuration: 400,
            strength: 10,
            frequency: 20,
            rotation: false,
        }),
    );
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 800,
                fadeOutDuration: 600,
                strength: 8,
                frequency: 30,
                rotation: false,
            }),
        )
        .delay(400);
    sequence
        .effect()
            .file("jb2a.chain_lightning.primary.blue")
            .scale(0.7)
            .atLocation(sourceToken, heightOffset)
            .stretchTo(target, targetHeightOffset)
            .xray()
            .aboveInterface()
            .filter("Glow", { color: 0x000000, distance: 40, outerStrength: 1 })
            .missed(targetsMissed.has(target.id));
}
sequence.play();
