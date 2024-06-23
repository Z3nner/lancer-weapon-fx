const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.bite",
    "modules/lancer-weapon-fx/soundfx/HeavyImpact.ogg",
    "jb2a.divine_smite.caster.blueyellow",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .effect()
        .file("jb2a.bite")
        .atLocation(target)
        .filter("ColorMatrix", { hue: 270 })
        .filter("Glow", { color: 0x8a0303, distance: 2, innerStrength: 2 })
        .zIndex(1)
        .opacity(0.7)
        .scaleToObject(3)
        .waitUntilFinished(targetsMissed.has(target.id) ? 0 : -1000);
    sequence
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/HeavyImpact.ogg")
        .playIf(!targetsMissed.has(target.id))
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence
        .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .playIf(!targetsMissed.has(target.id))
        .playbackRate(2.2)
        .scaleToObject(1.7)
        .filter("Glow", { color: 0x8a0303, distance: 2, innerStrength: 2 })
        .filter("ColorMatrix", { hue: 300 })
        .atLocation(target)
        .waitUntilFinished(-1000);
}
sequence.play();
