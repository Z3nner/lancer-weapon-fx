import { FlowInfo, getTokenByIdOrActorId, processFlowInfo } from "./common.js";
import { pGetMacroUuid } from "../effectResolver/effectResolver.js";
import { fallbackActionIdentifier as fallbackActionIdentifier_WeaponAttackFlow } from "./WeaponAttackFlow/heuristic.js";

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
        macroUuid: await pGetMacroUuid({
            // Prefer the token base actor, if available. This ensures linking for synthetic (NPC token) actors.
            actorUuid: state.actor?.token?.baseActor?.uuid || state.actor?.uuid,
            itemLid: state.item?.system?.lid,
            itemName: state.item?.name,
            fallbackActionIdentifier,
        }),
        targetTokens: zippedTargetInfo.map(({ target }) => target.target).filter(Boolean),
        targetsMissed: new Set(
            zippedTargetInfo
                .filter(({ hit_result }) => !hit_result?.hit)
                .map(({ target }) => target?.target?.id)
                .filter(Boolean),
        ),
    });
};

/* -------------------------------------------- */

/**
 * Allow "aborted" flows to trigger effects in some cases.
 * Examples:
 * - When a 1-structure mech suffers structure damage.
 *   The flow is aborted by the `noStructureRemaining` step.
 * - When a 1-stress mech suffers stress.
 *   The flow is aborted by the `noStressRemaining` step.
 */
const _isTriggerOnAbortedFlow = ({ flowName, flow }) => {
    if (flowName === "StructureFlow") return flow.state.data.remStruct === 0;
    if (flowName === "OverheatFlow") return flow.state.data.remStress === 0;
    return false;
};

/**
 * @param {string} options.flowName
 * @param {?((string|Function))} [options.fallbackActionIdentifier]
 */
const _bindFlowHook = options => {
    const { flowName, fallbackActionIdentifier: fallbackActionIdentifier_ = null } = options;

    Hooks.on(`lancer.postFlow.${flowName}`, async (flow, isContinue) => {
        if (!isContinue && !_isTriggerOnAbortedFlow({ flowName, flow })) return;

        const fallbackActionIdentifier =
            fallbackActionIdentifier_ != null && fallbackActionIdentifier_ instanceof Function
                ? fallbackActionIdentifier_(flow)
                : fallbackActionIdentifier_;

        const flowInfo = await _pGetFlowInfo(flow.state, {
            fallbackActionIdentifier,
        });
        if (flowInfo == null) return;

        await processFlowInfo(flowInfo);
    });
};

/* -------------------------------------------- */

const fallbackActionIdentifier_BasicAttackFlow = flow => {
    return flow.state.data.attack_type === "Melee" ? "lwfx_default_melee" : "lwfx_default_ranged";
};

/**
 * Convert a named structure flow to a `lwfx` fake LID.
 *
 * Includes support for "Lancer Alternative Structure"/"Maria's Alternate Ruleset" rules. This renames some results.
 * See:
 *  - https://foundryvtt.com/packages/lancer-alt-structure
 *  - https://docs.google.com/document/d/1unN3HDDeAK3pN1rmgFgZgAXp5flnQ9-KMu-TXt34tnU/edit
 */
const fallbackActionIdentifier_StructureFlow = flow => {
    switch (flow.state.data.title) {
        case "Crushing Hit":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.crushingHit"):
            return "lwfx_structure_crushing_hit";

        case "Direct Hit":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.directHit"):
            return `lwfx_structure_direct_hit_${Math.clamped(flow.state.data.remStruct, 1, 3)}`;

        case "System Trauma":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.systemTrauma"):
            return "lwfx_structure_system_trauma";

        case "Glancing Blow":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StructureTitles.glancingBlow"):
            return "lwfx_structure_glancing_blow";
    }
    return "lwfx_structure";
};

/**
 * Convert a named stress flow to a `lwfx` fake LID.
 *
 * Includes support for "Lancer Alternative Structure"/"Maria's Alternate Ruleset" rules. This renames some results.
 * See:
 *  - https://foundryvtt.com/packages/lancer-alt-structure
 *  - https://docs.google.com/document/d/1unN3HDDeAK3pN1rmgFgZgAXp5flnQ9-KMu-TXt34tnU/edit
 */
const fallbackActionIdentifier_OverheatFlow = flow => {
    switch (flow.state.data.title) {
        case "Irreversible Meltdown":
            return "lwfx_overheat_irreversible_meltdown";

        case "Meltdown":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.meltdown"):
            return `lwfx_overheat_meltdown_${Math.clamped(flow.state.data.remStress, 1, 3)}`;

        case "Destabilized Power Plant":
            return "lwfx_overheat_destabilized_power_plant";

        case "Emergency Shunt":
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.emergencyShunt"):
            return "lwfx_overheat_emergency_shunt";

        // Found in "Lancer Alternative Structure"
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.criticalFail"):
            return "lwfx_overheat_critical_reactor_failure";

        // Found in "Lancer Alternative Structure"
        case game.i18n.localize("LANCER-ALT-STRUCTURE.StressTitles.powerFail"):
            return "lwfx_overheat_power_failure";
    }
    return "lwfx_overheat";
};

const _onReady = () => {
    // Weapon attacks
    _bindFlowHook({
        flowName: "WeaponAttackFlow",
        fallbackActionIdentifier: fallbackActionIdentifier_WeaponAttackFlow,
    });
    // Basic attacks
    _bindFlowHook({ flowName: "BasicAttackFlow", fallbackActionIdentifier: fallbackActionIdentifier_BasicAttackFlow });

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
    _bindFlowHook({ flowName: "StructureFlow", fallbackActionIdentifier: fallbackActionIdentifier_StructureFlow });
    // Structure side effects (equipment destruction)
    _bindFlowHook({ flowName: "SecondaryStructureFlow", fallbackActionIdentifier: "lwfx_structure_secondary" });

    // Stress
    _bindFlowHook({ flowName: "OverheatFlow", fallbackActionIdentifier: fallbackActionIdentifier_OverheatFlow });

    // Cascades (structure/stress side effect)
    _bindFlowHook({ flowName: "CascadeFlow", fallbackActionIdentifier: "lwfx_cascade" });
};

export const bindHooks = () => {
    Hooks.on("ready", () => _onReady());
};
