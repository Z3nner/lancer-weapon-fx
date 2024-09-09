const {sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

await Sequencer.Preloader.preloadForClients([
    "jb2a.explosion_side.01.orange.1",
    "modules/lancer-weapon-fx/soundfx/DirectHitExplosion1.ogg",
    "jb2a.impact.005.orange",
    "jb2a.explosion.side_fracture.flask.01.0",
]);

const pivotx = token.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = token.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

new Sequence()

    .effect()
        .file("jb2a.explosion_side.01.orange.1")
        .atLocation(sourceToken, { randomOffset: 0.3, gridUnits: true})
        .randomSpriteRotation()
        .scaleToObject(1.4)
        .repeats(3, 125)
        .opacity(0.8)
    .effect()
        .file("jb2a.impact.005.orange")
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
        .file("jb2a.explosion.side_fracture.flask.01.0")
        .atLocation(sourceToken, { offset: { x: ipivotx, y: ipivoty}})
        .scaleToObject(1.4)
        .randomRotation()
        .delay(200)
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .belowTokens()

 .play();
