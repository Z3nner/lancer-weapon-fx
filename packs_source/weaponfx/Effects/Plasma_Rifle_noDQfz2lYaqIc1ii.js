const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const random = Sequencer.Helpers.random_float_between(300, 400);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg",
    "jb2a.impact.004.blue",
    "jb2a.lasershot.green",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Plasma_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .duration(633)
            .repeats(2, random);
    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.impact.004.blue")
            .playIf(!targetsMissed.has(target.id))
            .atLocation(`impact${i}`)
            .tint("#1aff34")
            .scaleToObject(2)
            .repeats(2, random)
            .delay(300)
            .playbackRate(1.5);
    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.lasershot.green")
            .atLocation(sourceToken)
            .stretchTo(target, { randomOffset: 0.3, gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .name(`impact${i}`)
            .repeats(2, random)
            .waitUntilFinished();
}
sequence.play();
