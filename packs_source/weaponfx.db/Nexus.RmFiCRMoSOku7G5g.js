let target = Array.from(game.user.targets)[0];

let sequence = new Sequence();

for (let target of Array.from(game.user.targets)) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Nexus_Fire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("modules/animated-spell-effects/spell-effects/energy/energy_throw_RAY_10.webm")
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target)
        .scale({x: 1.0, y: .5})
        .waitUntilFinished(-1300);
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Nexus_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.4));
    sequence.effect()
        .file("modules/animated-spell-effects/spell-effects/energy/energy_explosion_CIRCLE_05.webm")
        .atLocation(target)
        .scale(1.3)
        .zIndex(1)
        .waitUntilFinished(-1700);
}
sequence.play();
