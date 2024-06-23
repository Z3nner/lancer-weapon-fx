const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const target = game.modules.get("lancer-weapon-fx").api.getTargetLocationsFromTokenGroup(targetTokens, 1)[0];

await Sequencer.Preloader.preloadForClients(["modules/lancer-weapon-fx/soundfx/RetortLoop.ogg", "jb2a.breath_weapons02.burst.line", "jb2a.grease.dark_brown.loop"])

let sequence = new Sequence()


    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/RetortLoop.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    sequence.effect()
        .file("jb2a.breath_weapons02.burst.line")
        .atLocation(sourceToken)
        .filter("ColorMatrix", {hue: 180, brightness: 0.2, contrast: 0.5})
        .filter("Glow", {distance: 0.5, color: 0xd6c194, innerStrength: 2})
        .stretchTo(target)
        .playbackRate(1.5)
        .waitUntilFinished(-3500);

for (let i=0; i < targetTokens.length; i++) {
    let target = targetTokens[i];

    if (!targetsMissed.has(target.id)) {
        sequence.effect()
            .file("jb2a.grease.dark_brown.loop")
            .opacity(0.8)
            .fadeIn(800)
            .fadeOut(800)
            .atLocation(target, {randomOffset: 2, gridUnits: true})
            .belowTokens()
            .repeats(3)
            .scaleToObject(1);
    }
}
    sequence.play();
