const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const pTarget = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg",
    "jb2a.dancing_light.purplegreen",
    "jb2a.fumes.steam.white",
    "modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg",
    "jb2a.divine_smite.caster.blueyellow",
    "modules/lancer-weapon-fx/soundfx/DisplacerHit1.ogg",
    "jb2a.impact.blue",
]);

// get the average document.elevation of the targetTokens
// this is used to calculate the height of the effect
const averageElevation = targetTokens.reduce((sum, token) => sum + token.document.elevation, 0) / targetTokens.length;

pTarget.x += averageElevation * canvas.scene.grid.size;
pTarget.y -= averageElevation * canvas.scene.grid.size;

let sequence = new Sequence()

    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .startTime(900)
        .fadeInAudio(300)

    .effect()
        .file("jb2a.dancing_light.purplegreen")
        .tint("#2d0a3d")
        .filter("Glow", { strength: 1, color: 0x34e5d0 })
        .endTime(3000)
        .scale(0.4)
        .xray()
        .aboveInterface()
        .atLocation(sourceToken)
        .moveTowards(pTarget)
        .waitUntilFinished();

sequence
    .effect()
        .file("jb2a.fumes.steam.white")
        .fadeIn(1500)
        .fadeOut(1500)
        .atLocation(sourceToken)
        .spriteAnchor({ x: 0.2, y: 1.2 })
        .xray()
        .aboveInterface()
        .scaleToObject()
        .opacity(0.7);

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8));
sequence
    .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .tint("#2d0a3d")
        .filter("Glow", { strength: 1, color: 0x34e5d0 })
        .scale(0.9)
        .xray()
        .aboveInterface()
        .atLocation(pTarget)
        .waitUntilFinished(-1500);

for (let i = 0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.9, missed: targetsMissed.has(target.id) });

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/DisplacerHit1.ogg")
                .repeats(6, 200)
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.6));
        sequence
            .effect()
                .file("jb2a.impact.blue")
                .tint("#2d0a3d")
                .filter("Glow", { strength: 2, color: 0x34e5d0 })
                .scaleToObject(2)
                .xray()
                .aboveInterface()
                .atLocation(target, targetHeightOffset)
                .repeats(3, 400);
        sequence
            .effect()
                .file("jb2a.impact.blue")
                .tint("#2d0a3d")
                .filter("Glow", { strength: 2, color: 0x34e5d0 })
                .scaleToObject(2)
                .xray()
                .belowTokens()
                .atLocation(target, targetHeightOffset)
                .delay(200)
                .repeats(3, 400);
    }
}

sequence.play();
