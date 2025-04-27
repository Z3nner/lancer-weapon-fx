const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// Calculate the point 60% of the distance between sourceToken and pTarget
const pBlast = {
    x: sourceToken.position.x + 0.6 * (pTarget.x - sourceToken.position.x),
    y: sourceToken.position.y + 0.6 * (pTarget.y - sourceToken.position.y),
};

// get the token with the highest elevation
const elevatedTarget = targetTokens.reduce((prev, curr) => {
    return prev.document.elevation > curr.document.elevation ? prev : curr;
});

// get the calculated height of where the explosion should be based on the highest target
const pTargetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: elevatedTarget });

// add an extra offset to the target height offset to make it look like the explosion is above the heighest target
pTargetHeightOffset.offset.x = pTargetHeightOffset.offset.x + 1;
pTargetHeightOffset.offset.y = pTargetHeightOffset.offset.y - 1;

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg",
    "jb2a.bullet.01.orange",
    "jb2a.explosion.08",
    "modules/lancer-weapon-fx/soundfx/Flechette.ogg",
    "jb2a.bullet.02.orange",
    "jb2a.explosion_side.01.orange",
    "modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg",
]);

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .effect()
        .file("jb2a.bullet.01.orange")
        .from(sourceToken, heightOffset)
        .stretchTo(pBlast, pTargetHeightOffset)
        .xray()
        .aboveInterface()
        .waitUntilFinished(-200)
    .effect()
        .file("jb2a.explosion.08.orange")
        .atLocation(pBlast, pTargetHeightOffset)
        .scale(0.8)
        .xray()
        .aboveInterface()
        .zIndex(1)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

    sequence
        .effect()
            .file("jb2a.bullet.02.orange")
            .playIf(!targetsMissed.has(target.id))
            .scale(0.5)
            .atLocation(pBlast, pTargetHeightOffset)
            .stretchTo(target, targetHeightOffset)
            .xray()
            .aboveInterface()
        .effect()
            .file("jb2a.explosion_side.01.orange")
            .playIf(!targetsMissed.has(target.id))
            .atLocation(target, targetHeightOffset)
            .rotateTowards(pBlast)
            .center()
            .delay(350)
            .xray()
            .aboveInterface()
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .delay(350);
}
sequence.play();
