const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const waits = [1500, 2000, 1300, 1000, 1500, 1500];

// random number between 0 and 5
const animNum = Math.floor(Math.random() * waits.length);
const spearAnim = "jb2a.spear.melee.01.white." + animNum;

await Sequencer.Preloader.preloadForClients([
    spearAnim,
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.impact.orange.3",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });
    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });

    sequence
        .effect()
            .file(spearAnim)
            .filter("Glow", {
            color: 0x5f5858,
            innerStrength: 2,
            knockout: true,
            distance: 20,
        })
        .scale(0.8)
        .atLocation(sourceToken, heightOffset)
        .moveTowards(targetMoveTowards)
        .aboveInterface()
        .xray()
        .missed(targetsMissed.has(target.id))
        .waitUntilFinished(-waits[animNum]);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .endTime(600)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished(-800)
        .canvasPan()
            .playIf(!targetsMissed.has(target.id))
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 600,
                fadeInDuration: 50,
                fadeOutDuration: 300,
                strength: 10,
                frequency: 15,
                rotation: false,
            }),
        );

    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
            .playIf(!targetsMissed.has(target.id))
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
    sequence
        .effect()
            .file("jb2a.impact.orange.3")
            .playIf(!targetsMissed.has(target.id))
            .scaleToObject(2)
            .atLocation(target, targetHeightOffset)
            .aboveInterface()
            .xray()
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .randomSpriteRotation()
            .waitUntilFinished();
}
sequence.play();
