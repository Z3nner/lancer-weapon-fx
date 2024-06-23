const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

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

await Sequencer.Preloader.preloadForClients(["jb2a.bullet.Snipe.blue", "modules/lancer-weapon-fx/soundfx/veil_rifle.ogg"])

let sequence = new Sequence();


for (const target of targetTokens) {
    sequence.effect()
        .file("jb2a.bullet.Snipe.blue")
        .filter("ColorMatrix", {hue: 60})
        .filter("Glow", {distance: 3})
        .atLocation(sourceToken)
        .scale(0.8)
        .stretchTo(farthest)
        .missed(targetsMissed.has(target.id));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/veil_rifle.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
}
sequence.play();
