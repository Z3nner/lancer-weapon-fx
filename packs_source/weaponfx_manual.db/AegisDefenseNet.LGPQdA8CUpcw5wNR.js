//This macro is not linked to any weapon or system and must be applied manually.  It can be removed with the accompanying 'EndDefenseNet' macro, or through the Sequencer Manager

new Sequence()
	.effect("jb2a.shield.01.intro")
        .atLocation(token)
        .waitUntilFinished(-700)
        .scaleToObject(9.5)
    .effect("jb2a.shield.01.loop.blue")
        .fadeIn(300)
        .persist()
        .attachTo(token, { bindVisibility: true })
        .scaleToObject(9.5)        
.play()