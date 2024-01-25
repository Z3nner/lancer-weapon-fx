import { weaponEffects } from "./weaponEffects.js";
import "./api.js";
import {getMessageInfo} from "./messageParser.js";

// Register settings
Hooks.on("init", () => {
    game.settings.register("lancer-weapon-fx", "volume", {
        name: "lancer-weapon-fx.Sound Volume",
        hint: "lancer-weapon-fx.Sound Volume Hint",
        scope: "world",
        config: true,
        type: Number,
        range: {min: 0, max: 2, step: 0.1},
        default: 1.0,
    });

    game.settings.register("lancer-weapon-fx", "debug-is-default-miss", {
        name: "lancer-weapon-fx.Debug: Play Miss Animations by Default",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
    });
})

async function _executeMacroByName(
    macroName,
    sourceToken = {},
    {
        compendiumName = "lancer-weapon-fx.WeaponFX",
        messageId = null,
    } = {},
) {
    const pack = game.packs.get(compendiumName);
    if (pack) {
        const macro_data = (await pack.getDocuments()).find((i) => i.name === macroName)?.toObject();

        if (macro_data) {
            // Prepend the dynamic "messageId" value
            macro_data.command = `const messageId = "${messageId}";\n${macro_data.command}`;

            const temp_macro = new Macro(macro_data);
            temp_macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
            temp_macro.execute({actor: sourceToken.actor, token: sourceToken});
        } else {
            ui.notifications.error("Lancer Weapon FX | Macro " + macroName + " not found");
        }
    } else {
        ui.notifications.error("Lancer Weapon FX | Compendium " + compendiumName + " not found");
    }
}

Hooks.once("sequencer.ready", async function () {
    // Check if either free or Patreon JB2A module is installed and activated, otherwise return and display an error message.
    if (!game.modules.get('jb2a_patreon')?.active && !game.modules.get('JB2A_DnD5e')?.active) {
        const message = "Lancer Weapon FX | You need either the Free or the Patreon version of JB2A installed and active for this module to work properly!";
        console.error(`${message} The free version can be found at: https://foundryvtt.com/packages/JB2A_DnD5e`);
        ui.notifications.error(message, {permanent: true, console: false});
        return;
    }

    // preload effects data
    await Sequencer.Preloader.preload([
    "jb2a.arrow.physical.blue",
    "jb2a.breath_weapons02.burst.line.fire.orange.01",
    "jb2a.breath_weapons02.burst.cone.fire.orange.02",
    "jb2a.bolt.physical.orange",
    "jb2a.bullet.03.blue",
    "jb2a.bullet.01.orange",
    "jb2a.bullet.02.orange",
    "jb2a.bullet.Snipe.blue",
    "jb2a.burning_hands.01.orange",
    "jb2a.chain_lightning.primary.blue",
    "jb2a.claws.400px.red",
    "jb2a.dancing_light.purplegreen",
    "jb2a.disintegrate.green",
    "jb2a.divine_smite.caster.blueyellow",
    "jb2a.divine_smite.target.blueyellow",
    "jb2a.eldritch_blast.purple",
    "jb2a.energy_beam.normal.bluepink.02",
    "jb2a.energy_strands.complete.blue.01",
    "jb2a.energy_strands.range.multiple.purple.01.30ft",
    "jb2a.explosion.01.orange",
    "jb2a.explosion.02.blue",
    "jb2a.explosion.03.blueyellow",
    "jb2a.explosion.04.blue",
    "jb2a.fireball.beam.orange",
    "jb2a.fireball.explosion.orange",
    "jb2a.fire_jet.orange",
    "jb2a.fumes.steam.white",
    "jb2a.greataxe.melee.standard.white",
    "jb2a.healing_generic.400px.green",
    "jb2a.impact.004.blue",
    "jb2a.impact.blue",
    "jb2a.impact.ground_crack.orange",
    "jb2a.impact.orange.0",
    "jb2a.impact.orange.3",
    "jb2a.impact.yellow",
    "jb2a.lasershot.blue",
    "jb2a.lasershot.green",
    "jb2a.lasersword.melee.blue",
    "jb2a.lightning_ball.blue",
    "jb2a.lightning_bolt.narrow.blue",
    "jb2a.magic_missile.purple",
    "jb2a.pack_hound_missile",
    "jb2a.side_impact.part.smoke.blue",
    "jb2a.spear.melee.01.white.2",
    "jb2a.static_electricity",
    "jb2a.sword.melee.01.white",
    "jb2a.template_circle.vortex.loop.blue",
    "jb2a.throwable.launch.missile",
    "jb2a.toll_the_dead.green.shockwave",
    "jb2a.unarmed_strike.physical",
    "jb2a.warhammer.melee.01.white.4",
    "jb2a.zoning.inward.square.loop.bluegreen.01.01",
    "jb2a.zoning.inward.circle.loop",
    "modules/lancer-weapon-fx/icons/LatchDrone.png",
    "modules/lancer-weapon-fx/video/jetlancer_explosion_1000.webm",
    "modules/lancer-weapon-fx/video/pw_nuke_effect.webm"
    ], true);
    console.log('Lancer Weapon FX | Effects preloaded');
});

// Every time a chat message is posted...
Hooks.on("createChatMessage", (data) => {
    if(game.user.id !== data.user.id) return

    const messageMeta = getMessageInfo(data);
    if (messageMeta == null) return;

    const {weaponIdentifier, sourceToken} = messageMeta;

    var macroName;

    // weaponIdentifier can variously be either an object with Foundry item data, or a string
    // We use strings as a fallback, so that we can have effects for itemless actions (stabilizing, tech attacks, etc)
    if (weaponIdentifier instanceof Object)
    {
        // Check for any custom/user-defined macros first by checking the name of the object
        macroName = weaponEffects[weaponIdentifier?.system.name];
        if (!macroName)
        {
            // If we don't find them, then we check the hardcoded list
            macroName = weaponEffects[weaponIdentifier?.system.lid];
            if (!macroName)
                return;
        }
    }
    else
    {
        macroName = weaponEffects[weaponIdentifier];
        if (!macroName)
            return;
    }

    console.log("Lancer Weapon FX | Found macro '" + macroName + "' for weapon '" + weaponIdentifier + "', playing animation");
    _executeMacroByName(macroName, sourceToken, {messageId: data._id}).then(null);
});
