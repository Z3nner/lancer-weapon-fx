const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const hues = 270;

await Sequencer.Preloader.preloadForClients([
    "jb2a.claws.400px.red",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.2",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetHeightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: target });
    const targetRotateTowardsOfset = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: true });

    sequence // swing 1
        .effect()
            .file("jb2a.melee_generic.creature_attack.claw.002.red")
        //.filter("Glow", { color: 0x33ddff, distance: 4, knockout: true })
        .scaleToObject(2.5)
        .zIndex(1)
        .filter("ColorMatrix", { hue: hues, brightness: 1 })
        .filter("Glow", { color: 0xb23dc0, distance: 4 })
        .opacity(0.8)
        .atLocation(sourceToken, heightOffset)
        .rotateTowards(targetRotateTowardsOfset)
        .missed(targetsMissed.has(target.id))
        .playbackRate(2)
        .xray()
        .aboveInterface()
        .effect() // quick shock 1
            .file("jb2a.static_electricity.03.blue")
        //.filter("Glow", { color: 0x33ddff, distance: 4, knockout: true })
        .scaleToObject(1.5)
        .zIndex(1)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 150, brightness: 2 })
        .filter("Glow", { color: 0xb23dc0, distance: 4 })
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
            .scaleToObject(2.5)
            .zIndex(1)
            .filter("ColorMatrix", { hue: hues, brightness: 1 })
            .filter("Glow", { color: 0xb23dc0, distance: 4 })
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
            .filter("ColorMatrix", { hue: 150, brightness: 2 })
            .filter("Glow", { color: 0xb23dc0, distance: 4 })
            .startTimePerc(0.75)
            .atLocation(sourceToken, heightOffset)
            .rotateTowards(targetRotateTowardsOfset)
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .playbackRate(2.5)
            .xray()
            .aboveInterface()
            .delay(260);
    sequence
        .effect()
            .file("jb2a.claws.400px.red")
        //.scale(0.8)
        .zIndex(1)
        .filter("ColorMatrix", { hue: hues, brightness: 2 })
        .filter("Glow", { color: 0xb23dc0, distance: 4 })
        .opacity(0.9)
        .scaleToObject(2)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .xray()
        .aboveInterface()
        .atLocation(target, targetHeightOffset)
        .missed(targetsMissed.has(target.id));
    sequence
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(2, 250);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.impact.blue.2")
                .scale(1.0)
                .tint("#c91af9")
                .atLocation(target, targetHeightOffsetRand)
                .delay(200)
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .xray()
                .aboveInterface()
                .repeats(2, 250);
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
