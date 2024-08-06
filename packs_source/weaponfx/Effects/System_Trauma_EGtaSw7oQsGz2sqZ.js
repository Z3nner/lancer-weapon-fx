const {sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "modules/JB2A_DnD5e/Library/Generic/Explosion/SideExplosion01_02_Regular_Orange_600x600.webm",
    "modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg",
    "modules/JB2A_DnD5e/Library/Generic/Impact/Impact_05_Regular_Orange_400x400.webm",
    "modules/JB2A_DnD5e/Library/Generic/Explosion/SideFractureFlask01_01_800x400.webm",
]);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

new Sequence()

    .effect()
        .file("modules/JB2A_DnD5e/Library/Generic/Explosion/SideExplosion01_02_Regular_Orange_600x600.webm")
        .atLocation(sourceToken, { randomOffset: 0.3, gridUnits: true})
        .randomSpriteRotation()
        .scaleToObject(1.4)
        .repeats(3, 125)
        .opacity(0.8)
    .effect()
        .file("modules/JB2A_DnD5e/Library/Generic/Impact/Impact_05_Regular_Orange_400x400.webm")
        .atLocation(sourceToken, { randomOffset: 0.3, gridUnits: true})
        .randomSpriteRotation()
        .scaleToObject(1.6)
        .belowTokens()
        .repeats(3, 125)
        .opacity(0.8)
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .repeats(3, 125)
    .effect()
        .file("modules/JB2A_DnD5e/Library/Generic/Explosion/SideFractureFlask01_01_800x400.webm")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty}})
        .scaleToObject(1.4)
        .randomRotation()
        .delay(200)
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .belowTokens()

 .play();