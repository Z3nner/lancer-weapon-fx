let targets = Array.from(game.user.targets);

targets.forEach(target => {
    let sequence = new Sequence()

        .sound()
        .file("modules/lancer-weapon-fx/soundfx/Nexus_Fire.ogg")
        .volume(0.7 * game.settings.get("lancer-weapon-fx", "volume"))
        .effect()
        .file("jb2a.energy_strands.range.multiple.purple.01.30ft")
        .scale(1.4)
        .playbackRate(1.5)
        .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
        .stretchTo(target)
        .waitUntilFinished(-800)
        .sound()
        .file("modules/lancer-weapon-fx/soundfx/PPC2.ogg")
        .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
        .effect()
        .file("jb2a.static_electricity.02.blue")
        .scale(0.5)
        .atLocation(target)
        .waitUntilFinished()
        .play();
});
