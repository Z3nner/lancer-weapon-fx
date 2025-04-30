const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.claws.400px.red",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.melee_generic.creature_attack.claw.002.red",
    "jb2a.impact.blue.2",
    "jb2a.static_electricity.03.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });
    const targetRotateTowardsOfset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 0.5 });

    sequence // swing 1
        .effect()
            .file("jb2a.melee_generic.creature_attack.claw.002.red")
            .filter("Glow", { color: 0x33ddff, distance: 4, knockout: true })
            .scaleToObject(2.5)
            .zIndex(1)
            .opacity(0.8)
            .atLocation(sourceToken, heightOffset)
            .rotateTowards(targetRotateTowardsOfset)
            .missed(targetsMissed.has(target.id))
            .playbackRate(2)
            .xray()
            .aboveInterface()
        .effect() // quick shock 1
            .file("jb2a.static_electricity.03.blue")
            .scaleToObject(1.5)
            .zIndex(1)
            .opacity(0.8)
            .startTimePerc(0.75)
            .atLocation(sourceToken, heightOffset)
            .rotateTowards(targetRotateTowardsOfset)
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .playbackRate(2.5)
            .xray()
            .aboveInterface();
    sequence // swing 2
        .effect()
            .file("jb2a.melee_generic.creature_attack.claw.002.red")
            .filter("Glow", { color: 0x33ddff, distance: 4, knockout: true })
            .scaleToObject(2.5)
            .zIndex(1)
            .opacity(0.8)
            .atLocation(sourceToken, heightOffset)
            .rotateTowards(targetRotateTowardsOfset)
            .missed(targetsMissed.has(target.id))
            .playbackRate(2)
            .xray()
            .mirrorY()
            .aboveInterface()
            .delay(260)
        .effect() // quick shock 2
            .file("jb2a.static_electricity.03.blue")
            .scaleToObject(1.5)
            .zIndex(1)
            .opacity(0.8)
            .startTimePerc(0.75)
            .atLocation(sourceToken, heightOffset)
            .rotateTowards(targetRotateTowardsOfset)
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .playbackRate(2.5)
            .xray()
            .aboveInterface()
            .delay(260);
    sequence // Claws!
        .effect()
            .file("jb2a.claws.400px.red")
            .filter("Glow", { color: 0x33ddff, distance: 4, knockout: true })
            .scaleToObject(1.7)
            .zIndex(1)
            .opacity(0.8)
            .atLocation(target, targetHeightOffset)
            .missed(targetsMissed.has(target.id))
            .xray()
            .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
            .aboveInterface();
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(2, 250);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.static_electricity.03.blue")
                .atLocation(target, targetHeightOffset)
                .scaleToObject(1.5)
                .opacity(0.8)
                .repeats(3, 300)
                .delay(500)
                .mask(target)
                .randomSpriteRotation()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .xray()
                .aboveInterface()
            .effect()
                .file("jb2a.impact.011.blue")
                .scaleToObject(1)
                .atLocation(target, targetHeightOffsetRand)
                .filter("Glow", { color: 0x000000, distance: 30, outerStrength: 0 }) // light black glow to make it more readable
                .delay(200)
                .endTimePerc(0.5) // end early to make it look like a quick impact
                .repeats(2, 250)
                .randomSpriteRotation()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .xray()
                .aboveInterface();
        for (let j = 0; j < 2; j++) {
            // 2 impact shakes
            sequence
                .canvasPan()
                    .shake(
                    game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                        duration: 260 + j * 700, // second shake is longer
                        fadeOutDuration: 260 + j * 400, // adjusted fade out for second shake
                        strength: 15,
                        frequency: 15 - j * 5, // second shake is higher frequency to give feeling of power
                        rotation: false,
                    }),
                )
                .delay(j * 260); // j starts at 0, so first shake is 0 delay
        }
    } else {
        for (let j = 0; j < 2; j++) {
            // light swing shakes on miss
            sequence
                .canvasPan()
                    .shake(
                    game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                        duration: 250,
                        fadeOutDuration: 150,
                        fadeInDuration: 250,
                        strength: 12,
                        frequency: 25,
                        rotation: false,
                    }),
                )
                .delay(j * 260); // j starts at 0, so first shake is 0 delay
        }
    }
}
sequence.play();
