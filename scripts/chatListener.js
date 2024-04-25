import {weaponEffects} from "./weaponEffects.js";
import {getMessageInfo} from "./messageParser.js";

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

export const bindHooks = () => {
    // Every time a chat message is posted...
    Hooks.on("createChatMessage", (data) => {
        if(game.user.id !== data.user.id) return

        const messageMeta = getMessageInfo(data);
        if (messageMeta == null) return;

        const {weaponIdentifier, sourceToken} = messageMeta;

        const macroName = weaponEffects[weaponIdentifier];
        if (!macroName) return;

        console.log("Lancer Weapon FX | Found macro '" + macroName + "' for weapon '" + weaponIdentifier + "', playing animation");
        _executeMacroByName(macroName, sourceToken, {messageId: data._id}).then(null);
    });
};
