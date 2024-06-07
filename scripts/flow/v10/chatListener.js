import {getFlowInfo} from "./messageParser.js";
import {processFlowInfo} from "../common.js";


const _onReady = () => {
    if (foundry.utils.isNewerVersion(game.version, "11")) return;

    // Every time a chat message is posted...
    Hooks.on("createChatMessage", (data) => {
        if(game.user.id !== data.user.id) return

        const flowInfo = getFlowInfo(data);
        if (flowInfo == null) return;

        processFlowInfo(flowInfo);
    });
}

export const bindHooks = () => {
    Hooks.on("ready", () => _onReady());
};
