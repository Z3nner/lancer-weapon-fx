let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
    .volume(0.5 * game.settings.get("lancer-weapon-fx", "volume"))
    .effect()
    .file("jb2a.healing_generic.400px.green")
    .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
    .play();
