import { weaponEffects } from "./weaponEffects.js";

async function _executeMacroByName(
    macroName,
    sourceToken = {},
    targetTokens = [],
    compendiumName = "lancer-weapon-fx.WeaponFX"
) {
    const pack = game.packs.get(compendiumName);
    if (pack) {
        const macro_data = (await pack.getDocuments()).find((i) => i.data.name === macroName)?.toObject();

        if (macro_data) {
            const temp_macro = new Macro(macro_data);
            temp_macro.data.permission.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
            temp_macro.execute(sourceToken, targetTokens);
        } else {
            ui.notifications.error("Lancer Weapon FX | Macro " + macroName + " not found");
        }
    } else {
        ui.notifications.error("Lancer Weapon FX | Compendium " + compendiumName + " not found");
    }
}

function _getTokenByIdOrActorId(id) {
    let token = canvas.tokens.get(id);
    if (!token) {
        token = canvas.tokens.ownedTokens.filter(t => t.actor.id == id)?.[0];
        if (!token) {
            console.log("Lancer Weapon FX | No token with id '" + id + "' found.");
            return {};
        }
    }
    return token;
}

Hooks.once("sequencer.ready", async function () {
    // preload effects data
    await Sequencer.Preloader.preload([
        "jb2a.arrow.physical.blue",
        "jb2a.breath_weapons02.burst.line.fire.orange.01",
        "jb2a.bolt.physical.orange",
        "jb2a.bullet.01.orange",
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
        "jb2a.explosion.01.orange",
        "jb2a.explosion.03.blueyellow",
        "jb2a.explosion.blue",
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
        "jb2a.spear.melee.01.white.2",
        "jb2a.sword.melee.01.white",
        "jb2a.template_circle.vortex.loop.blue",
        "jb2a.toll_the_dead.green.shockwave",
        "jb2a.unarmed_strike",
        "jb2a.warhammer.melee.01.white.4",
        "jb2a.zoning.inward.square.loop.bluegreen.01.01",
        "modules/lancer-weapon-fx/icons/LatchDrone.png",
        "modules/animated-spell-effects/spell-effects/air/black_smoke_RAY_01.webm",
        "modules/animated-spell-effects/spell-effects/energy/energy_throw_RAY_10.webm",
        "modules/animated-spell-effects/spell-effects/energy/energy_explosion_CIRCLE_05.webm"
        ], true);
    console.log('Lancer Weapon FX | Effects preloaded');
});

// Every time a chat message is posted...
Hooks.on("createChatMessage", (data) => {
    // output the chat message data to console for easy reading
    if(game.user.id !== data.user.id) return
    let chatMessageDataContent = data.data.content ?? '';
    // Parse the chat message as XML so that we can navigate through it
    const parser = new DOMParser();
    const chatMessage = parser.parseFromString(chatMessageDataContent, "text/xml");
    // try to get macro details from reroll data
    // reroll data is embedded in the chat message under the reroll link in the `data-macro` attribute of the reroll <a> tag.
    // the reroll data is a JSON string that has been `encodeURIComponent`'d and then base64-encoded.
    let encodedRerollData = chatMessage.querySelectorAll("[data-macro]")?.[0].getAttribute("data-macro");
    if (!encodedRerollData) {
        return;
    }
    let rerollData = JSON.parse(decodeURIComponent(atob(encodedRerollData)));
    const sourceInfo = rerollData.args[0];
    const weaponItemId = rerollData.args[1];
    const targetTokens = rerollData.args[3].targets.map(t =>_getTokenByIdOrActorId(t.target_id));
    let sourceToken = _getTokenByIdOrActorId(sourceInfo.id);
    const weaponLID = sourceToken.actor.items.get(weaponItemId)?.data.data.lid;

    const macroName = weaponEffects[weaponLID];
    if (macroName) {
        console.log("Lancer Weapon FX | Found macro '" + macroName + "' for weapon '" + weaponLID + "', playing animation");
        _executeMacroByName(macroName, sourceToken, targetTokens);
    }
});