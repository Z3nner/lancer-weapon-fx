const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/BR_Fire.ogg",
    "jb2a.bullet.03.blue",
    "modules/lancer-weapon-fx/soundfx/KineticImpact.ogg",
    "jb2a.impact.orange.0",
]);

let sequence = new Sequence();

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/BR_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .duration(933)
            .delay(500)
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.bullet.03.blue")
            .atLocation(sourceToken)
            .scale(0.7)
            .zIndex(1)
            .playbackRate(1.5)
            .stretchTo(target, { randomOffset: 0.6, gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .name("hitLocation${i}")
            .delay(500)
            .waitUntilFinished(-600)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/KineticImpact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.impact.orange.0")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(1.5)
            .zIndex(2)
            .atLocation("hitLocation${i}")
            .rotateTowards(sourceToken)
            .rotate(230)
            .center();
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/BR_Fire.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .duration(933)
            .delay(500)
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.bullet.03.blue")
            .atLocation(sourceToken)
            .scale(0.7)
            .playbackRate(1.5)
            .stretchTo(target, { randomOffset: 0.6, gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .name("hitLocation${i}")
            .delay(500)
            .waitUntilFinished(-600)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/KineticImpact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.impact.orange.0")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(1.5)
            .atLocation("hitLocation${i}")
            .rotateTowards(sourceToken)
            .rotate(230)
            .center();
}
sequence.play();
