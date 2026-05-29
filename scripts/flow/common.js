import { MODULE_ID } from "../consts.js";

export class FlowInfo {
    constructor({ sourceToken, macroUuid, targetTokens = null, targetsMissed = new Set() }) {
        this.sourceToken = sourceToken;
        this.macroUuid = macroUuid;
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

export async function processFlowInfo(flowInfo) {
    const { macroUuid, sourceToken } = flowInfo;
    if (macroUuid == null) return;

    const macro = await fromUuid(macroUuid);
    if (!macro) {
        console.error(`Lancer Weapon FX | Could not load macro "${macroUuid}"!`);
        return;
    }

    const MacroCls = globalThis.Macro ?? foundry.documents?.Macro;
    if (!MacroCls) {
        console.error("Lancer Weapon FX | Macro class not available");
        return;
    }
    const temp_macro = new MacroCls(macro.toObject());

    (temp_macro.flags[MODULE_ID] ||= {}).flowInfo = flowInfo;
    temp_macro.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;

    temp_macro.execute({ actor: sourceToken?.actor, token: sourceToken });
}
