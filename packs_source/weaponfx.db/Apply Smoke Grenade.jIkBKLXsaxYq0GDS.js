const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

let params =
    [{
        filterType: "field",
        filterId: "mySmokeField",
        shieldType: 3,
        gridPadding: 2.4,
        color: 0xA9A9A9,
        time: 0,
        blend: 0,
        intensity: 0.4,
        lightAlpha: 0.9,
        lightSize: 0.5,
        scale: 1,
        radius: 1,
        chromatic: false,
        zOrder: 512,
        animated:
            {
                time:
                    {
                        active: true,
                        speed: 0.0015,
                        animType: "move",
                    },
            },
    }];

TokenMagic.addUpdateFilters(sourceToken, params);
