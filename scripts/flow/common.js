import {weaponEffects} from "../weaponEffects.js";
import {MODULE_ID} from "../consts.js";

export class FlowInfo {
	constructor (
		{
			sourceToken,
			actionIdentifier,
			targetTokens = null,
			targetsMissed = new Set(),
		}
	) {
		this.sourceToken = sourceToken;
		this.actionIdentifier = actionIdentifier;
		this.targetTokens = targetTokens;
		this.targetsMissed = targetsMissed;
	}
}

export function getTokenByIdOrActorId(id) {
	let token = canvas.tokens.get(id);
	if (!token) {
		token = canvas.tokens.ownedTokens.filter(t => t.actor.id === id)?.[0];
		if (!token) {
			console.log(`Lancer Weapon FX | No token with id '${id}' found.`);
			return null;
		}
	}
	return token;
}

async function _executeMacroByName(
	macroName,
	sourceToken = {},
	{
		compendiumName = `${MODULE_ID}.weaponfx`,
		flowInfo = null,
	} = {},
) {
	const pack = game.packs.get(compendiumName);
	if (pack) {
		const macro_data = (await pack.getDocuments()).find((i) => i.name === macroName)?.toObject();

		if (macro_data) {
			const temp_macro = new Macro(macro_data);

			(temp_macro.flags[MODULE_ID] ||= {}).flowInfo = flowInfo;
			temp_macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;

			temp_macro.execute({actor: sourceToken.actor, token: sourceToken});
		} else {
			ui.notifications.error(`Lancer Weapon FX | Macro ${macroName} not found`);
		}
	} else {
		ui.notifications.error(`Lancer Weapon FX | Compendium ${compendiumName} not found`);
	}
}

export async function processFlowInfo (flowInfo) {
	const {actionIdentifier, sourceToken} = flowInfo;

	const macroName = weaponEffects[actionIdentifier];
	if (!macroName) {
		console.log(`Lancer Weapon FX | Did not find macro for action '${actionIdentifier}'`);
		return;
	}

	console.log(`Lancer Weapon FX | Found macro '${macroName}' for action '${actionIdentifier}', playing animation`);
	_executeMacroByName(macroName, sourceToken, {flowInfo}).then(null);
}
