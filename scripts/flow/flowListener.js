import { FlowInfo, getTokenByIdOrActorId, processFlowInfo } from "./common.js";
import { pGetMacroUuid } from "../effectResolver/effectResolver.js";

/**
 * @param state
 * @param {?string} fallbackActionIdentifier Identifier used if the flow does not specify one.
 * @return {Promise<FlowInfo>}
 */
const _pGetFlowInfo = async (state, { fallbackActionIdentifier = null } = {}) => {
    const zippedTargetInfo = Array.from(
        {
            length: Math.max(state.data.acc_diff?.targets?.length || 0, state.data.hit_results?.length || 0),
        },
        (_, i) => ({
            target: state.data.acc_diff?.targets?.[i],
            hit_result: state.data.hit_results?.[i],
        }),
    );

    return new FlowInfo({
        sourceToken: getTokenByIdOrActorId(state.actor.token?.id || state.actor?.id),
        macroUuid: await pGetMacroUuid(state.item?.system?.lid, fallbackActionIdentifier),
        targetTokens: zippedTargetInfo.map(({ target }) => target.target).filter(Boolean),
        targetsMissed: new Set(
            zippedTargetInfo
                .filter(({ hit_result }) => !hit_result?.hit)
                .map(({ target }) => target?.target?.id)
                .filter(Boolean),
        ),
    });
};

/**
 * @param {string} flowName
 * @param {?((string|Function))} fallbackActionIdentifier
 */
const _bindFlowHook = ({ flowName, fallbackActionIdentifier = null }) => {
    Hooks.on(`lancer.postFlow.${flowName}`, async (flow, isSuccess) => {
        if (!isSuccess) return;

        if (fallbackActionIdentifier != null && fallbackActionIdentifier instanceof Function) {
            fallbackActionIdentifier = fallbackActionIdentifier(flow);
        }

        const flowInfo = await _pGetFlowInfo(flow.state, {
            fallbackActionIdentifier,
        });
        if (flowInfo == null) return;

        await processFlowInfo(flowInfo);
    });
};

const _onReady = () => {
    if (!foundry.utils.isNewerVersion(game.version, "11")) return;

    // Weapon attacks
    _bindFlowHook({ flowName: "WeaponAttackFlow" });
    // Basic attacks
    _bindFlowHook({
        flowName: "BasicAttackFlow",
        fallbackActionIdentifier: flow =>
            flow.state.data.attack_type === "Melee" ? "lwfx_default_melee" : "lwfx_default_ranged",
    });

    // Tech attacks and invades
    _bindFlowHook({ flowName: "TechAttackFlow", fallbackActionIdentifier: "default_tech_attack" });

    // Stabilize
    _bindFlowHook({ flowName: "StabilizeFlow", fallbackActionIdentifier: "lwfx_stabilize" });
    // Full repair
    _bindFlowHook({ flowName: "FullRepairFlow", fallbackActionIdentifier: "lwfx_stabilize" });

    // Core power
    _bindFlowHook({ flowName: "CoreActiveFlow", fallbackActionIdentifier: "lwfx_core_power" });

    // Other activations, which use an action
    // E.g. "Pattern-A Smoke Charges" -> "Use Quick"
    _bindFlowHook({ flowName: "ActivationFlow" });

    // Other activations, which do not use an action
    // E.g. "Rapid Burst Jump Jet System" -> "Use"
    _bindFlowHook({ flowName: "SystemFlow" });

    // Overcharge
    _bindFlowHook({ flowName: "OverchargeFlow", fallbackActionIdentifier: "lwfx_overcharge" });

    // Structure
    _bindFlowHook({ flowName: "StructureFlow", fallbackActionIdentifier: "lwfx_structure" });
    // Structure side effects (equipment destruction)
    _bindFlowHook({ flowName: "SecondaryStructureFlow", fallbackActionIdentifier: "lwfx_structure_secondary" });

    // Stress
    _bindFlowHook({ flowName: "OverheatFlow", fallbackActionIdentifier: "lwfx_overheat" });

    // Cascades (structure/stress side effect)
    _bindFlowHook({ flowName: "CascadeFlow", fallbackActionIdentifier: "lwfx_cascade" });
};

export const bindHooks = () => {
    Hooks.on("ready", () => _onReady());
};
