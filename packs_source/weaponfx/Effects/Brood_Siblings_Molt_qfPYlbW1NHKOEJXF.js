const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.melee_attack.03.trail.03.pinkpurple",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.impact.002.dark_red",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });
    const moveTowardsOffset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id), moveTowards: true });

    sequence
        .effect()
            .file("jb2a.melee_attack.03.trail.03.pinkpurple")
            .tint("#080303")
            .filter("Glow", { color: 0x8f0f0f })
            .scaleToObject(4.5)
            .atLocation(sourceToken, heightOffset)
            .aboveInterface()
            .xray()
            .moveTowards(target, moveTowardsOffset)
            .missed(targetsMissed.has(target.id))
            .waitUntilFinished(-2500);
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .delay(500)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7))
            .waitUntilFinished(-1350);

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1));
        sequence
            .effect()
                .file("jb2a.impact.002.dark_red")
                .scaleToObject(2)
                .atLocation(target, targetHeightOffset)
                .aboveInterface()
                .xray()
                .randomSpriteRotation()
                .waitUntilFinished(-1500);
    }
}
sequence.play();
