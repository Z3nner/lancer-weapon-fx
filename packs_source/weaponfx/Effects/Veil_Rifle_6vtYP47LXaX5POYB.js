const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const findFarthestTargetOfGroup = function (targetTokens) {
    let farthestToken = null;
    let farthestTokenDistance = 0;
    targetTokens.forEach(t => {
        let distance = canvas.grid.measureDistance(sourceToken, t);
        if (distance > farthestTokenDistance) {
            farthestToken = t;
            farthestTokenDistance = distance;
        }
    });

    return farthestToken;
};

const farthest = findFarthestTargetOfGroup(targetTokens);

const targetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: farthest, missed: targetsMissed.has(farthest.id) });

await Sequencer.Preloader.preloadForClients([
    "jb2a.bullet.Snipe.blue",
    "modules/lancer-weapon-fx/soundfx/veil_rifle.ogg",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .effect()
            .file("jb2a.bullet.Snipe.blue")
            .filter("ColorMatrix", { hue: 60 })
            .filter("Glow", { distance: 3 })
            .atLocation(sourceToken, heightOffset)
            .scale(0.8)
            .xray()
            .aboveInterface()
            .stretchTo(farthest, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 200,
                fadeOutDuration: 200,
                strength: 10,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(100);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
}
sequence.play();
