const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "emily3k.sfx.shotgun.equip",
    "emily3k.sfx.shotgun.shot.2",
    "modules/lancer-weapon-fx/soundfx/shotgun_impact.ogg",
    "jb2a.bullet.01.orange",
]);

// get the total number of targets missed, targetsMissed is undefined if no targets were missed so need to account for that
const totalMissed = targetsMissed ? targetsMissed.size : 0;

//get the total number of targets hit
const totalTargets = targetTokens.length - totalMissed;
console.log("total targets:" + targetTokens.length + " - total missed: " + totalMissed);
// calculate the total number of bullets to fire
// 6 base bullets + 1 per target hit after the first
const totalBullets = 6 + totalTargets - 1;
console.log(totalBullets);

// calculate the total amount of bullets to give to each target
const bulletsPerTarget = Math.floor(totalBullets / targetTokens.length);

//if we have leftovers, we want it to be given to the first target
const leftoverBullets = totalBullets % targetTokens.length;

let sequence = new Sequence();

sequence
    .sound()
        .file("emily3k.sfx.shotgun.equip")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .waitUntilFinished(-500);
sequence
    .sound()
        .file("emily3k.sfx.shotgun.shot.2")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1))
    //.delay(200)
    .canvasPan()
        .shake(
        game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
            duration: 100,
            fadeOutDuration: 25,
            strength: 25,
            frequency: 25,
            rotation: false,
        }),
    )
    .delay(500);

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: true, missed: targetsMissed.has(target.id) });

    sequence
        .effect()
            .file("jb2a.bullet.01.orange")
            .atLocation(sourceToken, heightOffset)
            .scale(0.8)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .playIf(!targetsMissed.has(target.id)) // only play if the target was hit
            .repeats(bulletsPerTarget)
            .aboveInterface()
            .xray()
            .delay(500);
    sequence
        .effect()
            .file("jb2a.bullet.01.orange")
            .atLocation(sourceToken, heightOffset)
            .scale(0.8)
            .stretchTo(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .playIf(targetsMissed.has(target.id)) // only play if the target was missed
            .repeats(bulletsPerTarget)
            .belowTokens()
            .xray()
            .delay(500);
    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 100,
                fadeOutDuration: 25,
                strength: 10,
                frequency: 15,
                rotation: false,
            }),
        )
        .delay(950)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/shotgun_impact.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6))
            .playIf(!targetsMissed.has(target.id))
            .delay(800);
}
sequence.play({ preload: true });
