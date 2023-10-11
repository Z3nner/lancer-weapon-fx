const {targetTokens} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let sequence = new Sequence();

for (const target of targetTokens) {
    let scale = 0.25 * target.actor.system.derived.mm.Size;
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/LockOn.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(1.0));
    sequence.effect()
        .file("jb2a.zoning.inward.square.loop.bluegreen.01.01")
        .atLocation(target)
        .scale(scale);
}

sequence.play();
