//This macro is not linked to any weapon or system and must be applied manually.  It can be removed with the accompanying 'EndDefenseNet' macro, or through the Sequencer Manager.
//It's intended for size one targets, if you apply it to larger targets it will probably be too big. Adjust the values in the .scaleToObject() parameters below to fit.

await Sequencer.Preloader.preloadForClients(["jb2a.shield.01.intro", "jb2a.shield.01.loop.blue"]);

new Sequence()

    .effect("jb2a.shield.01.intro")
        .atLocation(token)
        .waitUntilFinished(-700)
        .scaleToObject(9.5, { uniform: true })
    .effect("jb2a.shield.01.loop.blue")
        .fadeIn(300)
        .persist()
        .attachTo(token, { bindVisibility: true })
        .scaleToObject(9.5, { uniform: true })
    .play();
