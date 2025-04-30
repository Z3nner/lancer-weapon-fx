const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

// get the closest target to the sourceToken
const closestTarget = targetTokens.reduce((prev, curr) => {
    const prevDistance = canvas.grid.measureDistance(sourceToken.position, prev.position);
    const currDistance = canvas.grid.measureDistance(sourceToken.position, curr.position);
    return prevDistance < currDistance ? prev : curr;
}, targetTokens[0]);

const closestTargetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: closestTarget, tokenHeightPercent: 1 });

// // if we're isometric, add offset to the target height so it looks like the effect is targeting the average elevation
if (game.modules.get("lancer-weapon-fx").api.isIsometric()) {
    pTarget.x += closestTargetHeightOffset.offset.x * canvas.grid.size;
    pTarget.y += closestTargetHeightOffset.offset.y * canvas.grid.size;
}

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
    "jb2a.explosion.08.orange",
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
    .canvasPan()
        .shake({
        duration: 90,
        fadeOutDuration: 50,
        strength: 15,
        frequency: 25,
        rotation: false,
    })
    .effect()
        .file("jb2a.bullet.01.orange")
        .from(sourceToken, heightOffset)
        .stretchTo(pBlast)
        .waitUntilFinished(-200)
        .xray()
        .aboveInterface()
    .effect()
        .file("jb2a.explosion.08.orange")
        .atLocation(pBlast)
        .opacity(0.4)
        .scale(0.8)
        .zIndex(1)
        .xray()
        .aboveInterface()
    .canvasPan()
        .shake({
        duration: 150,
        fadeOutDuration: 50,
        strength: 15,
        frequency: 25,
        rotation: false,
    })
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/Flechette.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
sequence
    .canvasPan()
        .shake({
        duration: 100,
        fadeOutDuration: 30,
        strength: 30,
        frequency: 15,
        rotation: false,
    })
    .delay(100);

sequence
    .effect()
        .file("jb2a.bullet.02.orange")
        .scale(0.4)
        .atLocation(pBlast)
        .playbackRate(1.2)
        .stretchTo(backBlast, { randomOffset: 3, gridUnits: true })
        .repeats(4, 25)
        .xray()
        .belowTokens()
        .name("impact${i}");

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    let targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, sprayOffset: true, missed: targetsMissed.has(target.id) });

    sequence
        .effect()
            .file("jb2a.bullet.02.orange")
            .playIf(!targetsMissed.has(target.id))
            .scale(0.5)
            .playbackRate(0.8)
            .atLocation(pBlast)
            .stretchTo(target, targetHeightOffset)
            .xray()
            .aboveInterface()
        .effect()
            .file("jb2a.explosion_side.01.orange")
            .playIf(!targetsMissed.has(target.id))
            .atLocation(target, targetHeightOffset)
            .rotateTowards(pBlast)
            .center()
            .delay(450)
            .xray()
            .aboveInterface()
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .delay(450)
            .repeats(2, 300);
    for (let j = 0; j < 4; j++) {
        sequence
            .canvasPan()
                .shake({
                duration: 25,
                fadeOutDuration: 15,
                strength: 30,
                frequency: 10,
                rotation: false,
            })
            .delay(750 + j * 25);
    }
    sequence
        .effect()
            .file("jb2a.explosion_side.01.orange")
            .atLocation("impact${i}")
            .rotateTowards(pBlast)
            .playIf(!targetsMissed.has(target.id))
            .rotate(180)
            .scale(0.6)
            .repeats(4, 25)
            .center()
            .delay(750)
            .xray()
            .aboveInterface();
}
sequence.play();
