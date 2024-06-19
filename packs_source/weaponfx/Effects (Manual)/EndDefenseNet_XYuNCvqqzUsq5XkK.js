//This macro is not linked to any weapon or system and must be triggered manually.  Use this macro, or the Sequencer Manager, to end the 'AegisDefenseNet' effect.

let sequence = new Sequence();
    await Sequencer.Preloader.preloadForClients("jb2a.shield.01.outro_explode.blue")


new Sequence()

    .effect("jb2a.shield.01.outro_explode.blue")
        .atLocation(token)
        .scaleToObject(9.5, {uniform: true})
        .waitUntilFinished(-400)
        .thenDo(endFX)
.play()

    function endFX() {
        Sequencer.EffectManager.endEffects({ object: token})

    }

sequence.play();