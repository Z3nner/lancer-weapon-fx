const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// Calculate the point 70% of the distance between sourceToken and pTarget
const pBlast = {
    x: sourceToken.position.x + 0.7 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.7 * (pTarget.y - sourceToken.position.y),
};

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/NexusReady.ogg",
    "modules/lancer-weapon-fx/soundfx/NexusFire.ogg",
    "jb2a.bullet.01.orange",
    "jb2a.side_impact.part.smoke.blue",
    "jb2a.impact.004.blue",
    "jb2a.zoning.inward.circle.loop",
    "modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/NexusReady.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .waitUntilFinished();
sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/NexusFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 150);
sequence
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.bullet.01.orange")
        .filter("ColorMatrix", { hue: 70 })
        .filter("Blur", { blur: 8, strength: 10, blurX: 4 })
        .atLocation(sourceToken)
        .stretchTo(pBlast, { randomOffset: 0.6 })
        .repeats(3, 150)
        .waitUntilFinished(-800);
sequence
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.side_impact.part.smoke.blue")
        .filter("ColorMatrix", { hue: 230, brightness: 0.5 })
        .scale(0.8)
        .atLocation(pBlast, { randomOffset: 0.1 })
        .rotateTowards(pTarget)
        .repeats(3, 150)
        .waitUntilFinished(-2200);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.impact.004.blue")
            .playIf(!targetsMissed.has(target.id))
            .filter("ColorMatrix", { hue: 235, brightness: 0.5 })
            .scale(0.5)
            .zIndex(1)
            .atLocation(target, { randomOffset: 0.5, gridUnits: true })
            .repeats(3, 100);
    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.zoning.inward.circle.loop")
            .playIf(!targetsMissed.has(target.id))
            .scale(0.4)
            .fadeOut(3800, { ease: "easeOutBack" })
            .belowTokens()
            .atLocation(target);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/NexusConfirm.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .playIf(!targetsMissed.has(target.id));
}
sequence.play();
