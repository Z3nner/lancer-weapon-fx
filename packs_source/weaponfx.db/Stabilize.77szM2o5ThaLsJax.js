let sequence = new Sequence()
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/Stabilize.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .effect()
    .file("jb2a.healing_generic.400px.green")
    .atLocation(canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId)
    .play();
