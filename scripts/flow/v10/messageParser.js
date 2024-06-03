import {FlowInfo, getTokenByIdOrActorId} from "../common.js";

function _getTargetsMissed(chatMessageDom, targets) {
    const hitChips = [...chatMessageDom.querySelectorAll(".lancer-hit-chip")];

    if (targets.length !== hitChips.length) {
        console.warn(`Lancer Weapon FX | Number of targets (${targets.length}) did not match number of hit/miss markers (${hitChips.length})`);
        return new Set();
    }

    // Assumes the targets list and the visual chat message chips are in the same order
    const targetsMissed = new Set();
    targets.forEach((target, i) => {
        const hitChip = hitChips[i];
        if (hitChip.classList?.contains("miss")) targetsMissed.add(target.target_id);
    })
    return targetsMissed;
}

/**
 * @param {ChatMessage} data
 * @return {null|FlowInfo}
 */
export function getFlowInfo (data) {
    let chatMessageDataContent = data.content ?? '';
    // Parse the chat message as XML so that we can navigate through it
    const parser = new DOMParser();
    const chatMessage = parser.parseFromString(chatMessageDataContent, "text/html");

    // try to get macro details from reroll data
    // reroll data is embedded in the chat message under the reroll link in the `data-macro` attribute of the reroll <a> tag.
    // the reroll data is a JSON string that has been `encodeURIComponent`'d and then base64-encoded.
    let encodedRerollData = chatMessage.querySelectorAll("[data-macro]")?.[0]?.getAttribute("data-macro");

    if (!encodedRerollData) {
        const header = chatMessage.querySelector(".lancer-header");
        if (!header) return null;

        const regexIsStabilize = /^\/\/ .+ HAS STABILIZED \/\/$/;
        if (regexIsStabilize.test(header.innerHTML)) {
            console.log("it's a stabilize!!");
            return new FlowInfo({
                sourceToken: getTokenByIdOrActorId(data.speaker.actor),
                actionIdentifier: "lwfx_stabilize",
            })
        }

        return null;
    }

    const rerollData = JSON.parse(decodeURIComponent(atob(encodedRerollData)));
    if (rerollData.fn === "prepareEncodedAttackMacro") {
        const [sourceInfo, weaponItemId, , {targets}] = rerollData.args;

        const sourceToken = getTokenByIdOrActorId(sourceInfo.id);
        const targetTokens = targets.map(t =>getTokenByIdOrActorId(t.target_id));
        return new FlowInfo({
            sourceToken,
            actionIdentifier: sourceToken.actor.items.get(weaponItemId)?.system.lid,
            targetTokens,
            targetsMissed: _getTargetsMissed(chatMessage, targets),
        });
    }

    if (rerollData.fn === "prepareTechMacro") {
        const [sourceInfo, , {targets}] = rerollData.args;

        return new FlowInfo({
            sourceToken: getTokenByIdOrActorId(sourceInfo),
            actionIdentifier: "default_tech_attack",
            targetTokens: targets.map(t =>getTokenByIdOrActorId(t.target_id)),
            targetsMissed: _getTargetsMissed(chatMessage, targets),
        })
    }

    if (rerollData.fn === "prepareActivationMacro") {
        const [sourceInfo, triggeringItemId, , actionName, {targets}] = rerollData.args;

        const sourceToken = getTokenByIdOrActorId(sourceInfo);

        let triggeringItem = sourceToken.actor.items.get(triggeringItemId);
        if (!triggeringItem) return null;

        if (!["Invade", "Full Tech", "Quick Tech"].includes(triggeringItem.system.actions[actionName].activation)) return null;

        return new FlowInfo({
            sourceToken,
            actionIdentifier: "default_tech_attack",
            targetTokens: targets.map(t =>getTokenByIdOrActorId(t.target_id)),
            targetsMissed: _getTargetsMissed(chatMessage, targets),
        });
    }

    // we don't serve your kind here
    return null;
}
