const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const targetToken = game.user.targets.first();

const pivotx = targetToken.document.flags["hex-size-support"]?.pivotx || 0;
const ipivotx = -pivotx;

const pivoty = targetToken.document.flags["hex-size-support"]?.pivoty || 0;
const ipivoty = -pivoty;

await Sequencer.Preloader.preloadForClients([
    "jb2a.claws.400px.red",
    "modules/lancer-weapon-fx/soundfx/Melee.ogg",
    "jb2a.impact.blue.2",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    sequence
        sequence.effect()
            .file("jb2a.claws.400px.red")
            .filter("Glow", { color: 0x33ddff, distance: 4, knockout: true } )
            .scaleToObject(1.7)
            .zIndex(1)
            .opacity(0.8)
            .atLocation(target, { offset: { x: ipivotx, y: ipivoty}})
            .missed(targetsMissed.has(target.id)); 
        sequence.sound()
            .file("modules/lancer-weapon-fx/soundfx/Melee.ogg")
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
            .repeats(2, 250);
    if (!targetsMissed.has(target.id)) {
        sequence
            .effect()
                .file("jb2a.static_electricity.03")
                .atLocation(target, { offset: { x: ipivotx, y: ipivoty}})
                .scaleToObject(1)
                .opacity(0.8)
                .repeats(3, 300)
                .delay(500)
                .mask(target)
            .effect()
                .file("jb2a.impact.blue.2")
                .scaleToObject(1.5)
                .atLocation(target, { randomOffset: 0.5, gridUnits: true })
                .spriteOffset( { x: ipivotx, y: ipivoty})
                .mask(target)
                .delay(200)
                .opacity(0.8)
                .repeats(2, 250);
    }
}
sequence.play();