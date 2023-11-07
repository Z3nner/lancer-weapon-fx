const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const target = targetTokens[0];

let sequence = new Sequence()
    .effect()
    .file("jb2a.breath_weapons02.burst.line.fire.orange.01")
    .atLocation(sourceToken)
    .rotateTowards(target)
    .sound()
    .file("modules/lancer-weapon-fx/soundfx/flamethrower_fire.ogg")
    .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
    .play();
