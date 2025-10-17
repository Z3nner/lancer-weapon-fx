const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// Calculate the point 80% of the distance between sourceToken and pTarget
const pBlast = {
    x: sourceToken.position.x + 0.8 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.8 * (pTarget.y - sourceToken.position.y),
};

// Calculate the point 150% of the distance between sourceToken and pTarget
const backBlast = {
    x: sourceToken.position.x + 1.4 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 1.4 * (pTarget.y - sourceToken.position.y),
};

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg",
    "jb2a.bullet.01.orange",
    "jb2a.explosion.08",
    "modules/lancer-weapon-fx/soundfx/Flechette.ogg",
    "jb2a.bullet.02.orange",
    "jb2a.explosion_side.01",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.bullet.01.orange")
        .from(sourceToken)
        .stretchTo(pBlast)
        .waitUntilFinished(-200)
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.explosion.08")
        .atLocation(pBlast)
        .opacity(0.4)
        .scale(0.8)
        .zIndex(1)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .effect()
        .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
        .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
        .file("jb2a.bullet.02.orange")
        .scale(0.4)
        .atLocation(pBlast)
        .playbackRate(0.8)
        .stretchTo(backBlast, { randomOffset: 3, gridUnits: true })
        .repeats(4, 25)
        .name("impact${i}");

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    sequence
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.bullet.02.orange")
            .playIf(!targetsMissed.has(target.id))
            .scale(0.5)
            .playbackRate(0.8)
            .atLocation(pBlast)
            .stretchTo(target)
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.explosion_side.01")
            .playIf(!targetsMissed.has(target.id))
            .atLocation(target)
            .rotateTowards(pBlast)
            .center()
            .delay(450)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .delay(450)
            .repeats(2, 300)
        .effect()
            .xray(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreFogOfWar())
            .aboveInterface(game.modules.get("lancer-weapon-fx").api.isEffectIgnoreLightingColoration())
            .file("jb2a.explosion_side.01")
            .atLocation("impact${i}")
            .rotateTowards(pBlast)
            .playIf(!targetsMissed.has(target.id))
            .rotate(180)
            .scale(0.6)
            .repeats(4, 25)
            .center()
            .delay(750);
}
sequence.play();
