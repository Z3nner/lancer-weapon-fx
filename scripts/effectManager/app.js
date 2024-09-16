import { MODULE_ID, PACK_ID_WEAPONFX } from "../consts.js";
import { SETTING_EFFECTS_MANAGER_STATE } from "../settings.js";
import { EffectManagerData } from "./models.js";
import { getMacroVariables, getSearchString } from "../utils.js";
import { CUSTOM_EFFECT_MODE_LID, CUSTOM_EFFECT_MODE_NAME, TOUR_ID } from "./consts.js";
import { EFFECTS_WEAR_AND_TEAR, EFFECTS_GEAR } from "../weaponEffects.js";

/**
 * Singleton app to manage effects.
 *
 * Notes on singleton implementation:
 * - If two GM users both have the app open, and one GM edits the state, we want the state to sync to both apps for
 *   both clients.
 *   The world-level game setting therefore triggers `onStateChange` here, causing a re-render.
 * - As a side effect of the above, changing the state in the app locally does not directly trigger a re-render for the
 *   app. Instead, a cascade of effects occurs:
 *     `GM makes change in UI -> change is saved to world state -> world state change triggers re-render`
 * - The app has an `id` provided in the `defaultOptions`. This gives us some singleton behaviour for free.
 *   Positive:
 *   - Opening a new instance of the manager re-uses the existing window. The app therefore appears as a singleton to
 *     the user.
 *   Negative:
 *   - The new instance *steals* the window from the existing app, without closing or cleaning up the existing app.
 *     The old app will still be "open" so we need to avoid triggering renders for every effect manager, and instead
 *     render only the most recently opened (and therefore visible) one. Note that Foundry passes in the "inner"
 *     element to `activateListeners` and so we are safe to bind event listeners.
 */
export class EffectManagerApp extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `${MODULE_ID}-effects-manager`,
            template: `modules/${MODULE_ID}/templates/effectManager/effect-manager.hbs`,
            title: game.i18n.localize(`${MODULE_ID}.effectManager.app.Effects Manager`),
            width: 800,
            height: 800,
            submitOnChange: true,
            closeOnSubmit: false,
            scrollY: [".lwfx__scrollable"],
            resizable: true,
            classes: ["lancer sheet"],
            dragDrop: [
                {
                    dragSelector: "[data-drag-type]",
                    dropSelector: "[data-drop-target]",
                },
            ],
        });
    }

    /* -------------------------------------------- */

    static _appActive = null;

    static onStateChange({ state }) {
        if (!this._appActive) return;
        this._appActive.setState(state);
        this._appActive.render();
    }

    /* -------------------------------------------- */

    /** @type {?Array<Macro>} */
    static _macroLookup = null;

    static async _pInitMacroLookup() {
        if (this._macroLookup) return;

        const pack = game.packs.get(PACK_ID_WEAPONFX);
        if (!pack) {
            this._macroLookup = [];
            ui.notifications.error(`Lancer Weapon FX | Compendium ${PACK_ID_WEAPONFX} not found`);
            return;
        }

        const index = await pack.getIndex();

        this._macroLookup = index
            .map(({ name, uuid }) => ({ name, uuid }))
            .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB, { sensitivity: "base" }));
    }

    /* -------------------------------------------- */

    /** @type {?EffectManagerData} */
    _datamodel;

    /** @type {?Object} */
    _iptsTransient;

    constructor(...args) {
        super(...args);
        EffectManagerApp._appActive = this;
        this.setState(
            game.settings.get(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE) || new EffectManagerData().toObject(),
        );
    }

    setState(state) {
        if (!state) throw new Error(`Missing state!`);
        this._datamodel = new EffectManagerData(state);
    }

    /* -------------------------------------------- */

    /** @override */
    async _render(force, options) {
        await this.constructor._pInitMacroLookup();
        return super._render(force, options);
    }

    /** @override */
    async _renderInner(...args) {
        const $html = await super._renderInner(...args);

        this._iptsTransient = {};
        $html.find(`[data-name-transient]`).each((i, ipt) => {
            const nameTransient = ipt.getAttribute("data-name-transient");
            foundry.utils.setProperty(this._iptsTransient, nameTransient, ipt);
        });

        return $html;
    }

    /* -------------------------------------------- */

    /** @override */
    async close(options) {
        if (this.constructor._appActive === this) this.constructor._appActive = null;
        return super.close(options);
    }

    /* -------------------------------------------- */

    /** @type {?Object<string, string>} */
    _getDataCache_macro_choices;

    /** @type {?Array<string>} */
    _getDataCache_lids;

    /** @override */
    async getData(options = {}) {
        const dataModel = this._datamodel.toObject();

        const effectCounts = this._getData_getEffectCounts({ dataModel });

        const effects = Object.entries(dataModel.effects).map(([id, effect]) => ({
            id,
            ...effect,
            isDuplicate: this._getData_isEffectDuplicate({ dataModel, effect, effectCounts }),
        }));

        const folders = await Promise.all(
            Object.entries(dataModel.folders).map(async ([id, folder]) => ({
                id,
                ...folder,
                actorLink: await this._getData_pGetActorLinkHtml({ actorUuid: folder.actorUuid }),
                effects: effects.filter(effect => effect.folderId === id),
            })),
        );

        this._getDataCache_macro_choices ||= Object.fromEntries(
            this.constructor._macroLookup.map(({ name, uuid }) => [uuid, name]),
        );

        this._getDataCache_lids ||= Array.from(
            new Set([
                ...Object.keys(EFFECTS_WEAR_AND_TEAR),
                ...Object.keys(EFFECTS_GEAR),

                "lwfx_core_power",
                "lwfx_cascade",
                "lwfx_overcharge",
                "lwfx_overheat",
                "lwfx_overheat_emergency_shunt",
                "lwfx_overheat_destabilized_power_plant",
                "lwfx_overheat_meltdown_3",
                "lwfx_overheat_meltdown_2",
                "lwfx_overheat_meltdown_1",
                "lwfx_overheat_irreversible_meltdown",
                "lwfx_stabilize",
                "lwfx_structure",
                "lwfx_structure_glancing_blow",
                "lwfx_structure_system_trauma",
                "lwfx_structure_secondary",
                "lwfx_structure_direct_hit_3",
                "lwfx_structure_direct_hit_2",
                "lwfx_structure_direct_hit_1",
                "lwfx_structure_crushing_hit",
                "lwfx_overheat_power_failure",
                "lwfx_overheat_critical_reactor_failure",
            ]),
        ).sort((a, b) => a.localeCompare(b, { sensitivity: "base" }));

        return {
            // TODO(v12) use fields to generate inputs
            fields: this._datamodel.schema.fields,

            effects,

            folders,

            effectsUncategorized: effects.filter(effect => effect.folderId == null),

            isDisplayUsageHint: !effects.length && !folders.length,
            isDisplayEffectsUncategorized: effects.length,

            rowModes: {
                choices: {
                    [CUSTOM_EFFECT_MODE_NAME]: game.i18n.localize(`${MODULE_ID}.effectManager.app.Name`),
                    [CUSTOM_EFFECT_MODE_LID]: game.i18n.localize(`${MODULE_ID}.effectManager.app.Lancer ID`),
                },
                CUSTOM_EFFECT_MODE_NAME,
                CUSTOM_EFFECT_MODE_LID,
            },

            macros: {
                choices: this._getDataCache_macro_choices,
            },

            lids: this._getDataCache_lids,
        };
    }

    async _getData_pGetActorLinkHtml({ actorUuid }) {
        if (actorUuid == null) return null;

        // Fake a regex match
        const lnk = await TextEditor._createContentLink([
            `@UUID[${actorUuid}]`, // m0, full match
            "UUID", // m1, type
            actorUuid, // m2, target
        ]);
        if (!lnk) return null;

        lnk.classList.add("lwfx-effects-manager__actor-link");

        return lnk.outerHTML;
    }

    _getData_getEffectCountPath({ dataModel, effect, searchName }) {
        const actorUuid = dataModel.folders[effect.folderId]?.actorUuid || "_";
        return ["name", actorUuid, effect.mode, searchName].join(".");
    }

    _getData_getEffectCounts({ dataModel }) {
        const effectCounts = {};

        Object.values(dataModel.effects).forEach(effect => {
            switch (effect.mode) {
                case CUSTOM_EFFECT_MODE_NAME: {
                    const searchName = getSearchString(effect.itemName);
                    if (!searchName) return;
                    const propPath = this._getData_getEffectCountPath({ dataModel, effect, searchName });
                    foundry.utils.setProperty(
                        effectCounts,
                        propPath,
                        (foundry.utils.getProperty(effectCounts, propPath) || 0) + 1,
                    );
                    return;
                }

                case CUSTOM_EFFECT_MODE_LID: {
                    const searchName = getSearchString(effect.itemLid);
                    if (!searchName) return;
                    const propPath = this._getData_getEffectCountPath({ dataModel, effect, searchName });
                    foundry.utils.setProperty(
                        effectCounts,
                        propPath,
                        (foundry.utils.getProperty(effectCounts, propPath) || 0) + 1,
                    );
                    return;
                }

                default:
                    throw new Error(`Unknown mode: ${effect.mode}`);
            }
        });

        return effectCounts;
    }

    _getData_isEffectDuplicate({ dataModel, effect, effectCounts }) {
        switch (effect.mode) {
            case CUSTOM_EFFECT_MODE_NAME: {
                const propPath = this._getData_getEffectCountPath({
                    dataModel,
                    effect,
                    searchName: getSearchString(effect.itemName),
                });
                return foundry.utils.getProperty(effectCounts, propPath) > 1;
            }

            case CUSTOM_EFFECT_MODE_LID: {
                const propPath = this._getData_getEffectCountPath({
                    dataModel,
                    effect,
                    searchName: getSearchString(effect.itemLid),
                });
                return foundry.utils.getProperty(effectCounts, propPath) > 1;
            }

            default:
                throw new Error(`Unknown mode: ${effect.mode}`);
        }
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners($html) {
        super.activateListeners($html);

        $html.on("click", `[name="btn-effect-create"]`, this._handleClick_createEffect.bind(this));
        $html.on("click", `[name="btn-folder-create"]`, this._handleClick_createFolder.bind(this));
        $html.on("click", `[name="btn-export"]`, this._handleClick_export.bind(this));
        $html.on("click", `[name="btn-import"]`, this._handleClick_import.bind(this));
        $html.on("click", `[name="btn-start-tour"]`, this._handleClick_startTour.bind(this));
        $html.on("click", `[name="btn-selected-delete"]`, this._handleClick_deleteSelected.bind(this));

        $html.on("click", `[name="btn-folder-expand-collapse"]`, this._handleClick_folderExpandCollapse.bind(this));
        $html.on("click", `[name="btn-folder-create-effect"]`, this._handleClick_folderCreateEffect.bind(this));
        $html.on("click", `[data-name="btn-folder-actor-unlink"]`, this._handleClick_folderActorUnlink.bind(this));
        $html.on("click", `[name="btn-folder-delete"]`, this._handleClick_folderDelete.bind(this));

        $html.on("click", `[name="btn-effect-play"]`, this._handleClick_playPreview.bind(this));

        $html.on("change", `[data-name-proxy]`, this._handleChange_inputProxy.bind(this));

        this._iptsTransient["select-all"].addEventListener("change", this._handleChange_cbSelectAll.bind(this));
        Object.entries(this._iptsTransient["effects"] || {}).forEach(([, nameTo]) => {
            nameTo["isSelected"].addEventListener("change", this._handleChange_cbEffect.bind(this));
        });
    }

    /* ----- */

    async _handleChange_cbSelectAll(evt) {
        evt.stopPropagation();

        const val = this._iptsTransient["select-all"].checked;
        Object.entries(this._iptsTransient["effects"]).forEach(([, nameTo]) => (nameTo["isSelected"].checked = val));
    }

    async _handleChange_cbEffect(evt) {
        evt.stopPropagation();

        const cntSelected = Object.entries(this._iptsTransient["effects"]).reduce(
            (cnt, [, nameTo]) => cnt + Number(nameTo["isSelected"].checked),
            0,
        );

        if (!cntSelected) {
            this._iptsTransient["select-all"].checked = false;
            this._iptsTransient["select-all"].indeterminate = false;
            return;
        }

        const cntEffects = Object.keys(this._datamodel.effects).length;
        if (cntEffects === cntSelected) {
            this._iptsTransient["select-all"].checked = true;
            this._iptsTransient["select-all"].indeterminate = false;
            return;
        }

        this._iptsTransient["select-all"].checked = true;
        this._iptsTransient["select-all"].indeterminate = true;
    }

    /* ----- */

    async _handleClick_createEffect(evt) {
        await this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect(),
        });
    }

    async _handleClick_createFolder(evt) {
        await this._updateObject(null, {
            [`folders.${foundry.utils.randomID()}`]: this._getNewFolder(),
        });
    }

    async _handleClick_export(evt) {
        saveDataToFile(
            JSON.stringify(this._datamodel.toObject(), null, 2),
            "text/json",
            `${MODULE_ID}-custom-effects.json`,
        );
    }

    async _handleClick_import(evt) {
        new Dialog(
            {
                title: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import Custom Effects`),
                content: await renderTemplate("templates/apps/import-data.html", {
                    hint1: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import Custom Effects Hint 1`),
                    hint2: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import Custom Effects Hint 2`),
                }),
                buttons: {
                    import: {
                        icon: `<i class="fas fa-file-import"></i>`,
                        label: game.i18n.localize(`${MODULE_ID}.effectManager.app.Import`),
                        callback: async html => {
                            const form = html.find("form")[0];
                            if (!form.data.files.length)
                                return ui.notifications.error("You did not upload a data file!");
                            const txt = await readTextFromFile(form.data.files[0]);

                            let json;
                            try {
                                json = JSON.parse(txt);
                            } catch (e) {
                                return ui.notifications.error(`File was not valid JSON! ${e.message}`);
                            }

                            let state;
                            try {
                                state = new EffectManagerData(json);
                            } catch (e) {
                                return ui.notifications.error(`JSON file did not contain valid state! ${e.message}`);
                            }

                            game.settings.set(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, state.toObject());
                        },
                    },
                    no: {
                        icon: `<i class="fas fa-times"></i>`,
                        label: "Cancel",
                    },
                },
                default: "import",
            },
            {
                width: 400,
            },
        ).render(true);
    }

    async _handleClick_startTour(evt) {
        const tour = game.tours.get(`${MODULE_ID}.${TOUR_ID}`);
        await tour.reset();
        if (tour?.status !== Tour.STATUS.UNSTARTED) return;
        tour.start();
    }

    async _handleClick_deleteSelected(evt) {
        const effectIds = Object.entries(this._iptsTransient["effects"])
            .filter(([, nameTo]) => nameTo["isSelected"].checked)
            .map(([effectId]) => effectId);
        if (!effectIds.length) return ui.notifications.warn(`Please select some effects first!`);

        if (
            !(await Dialog.confirm({
                title: game.i18n.localize("lancer-weapon-fx.effectManager.app.Delete Selected Effects"),
                content: `<h4>${game.i18n.localize("AreYouSure")}</h4><p>${game.i18n.format("lancer-weapon-fx.effectManager.app.Delete Selected Effects Hint", { count: effectIds.length })}</p>`,
            }))
        )
            return;

        await this._updateObject(null, Object.fromEntries(effectIds.map(effectId => [`effects.-=${effectId}`, null])));
    }

    /* ----- */

    async _handleClick_folderExpandCollapse(evt) {
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");
        const folderId = eleFolder?.getAttribute("data-folder-id");
        if (!folderId) throw new Error("Should never occur!");

        await this._updateObject(null, {
            [`folders.${folderId}`]: {
                isCollapsed: !this._datamodel.folders[folderId].isCollapsed,
            },
        });
    }

    async _handleClick_folderCreateEffect(evt) {
        const folderId = evt.currentTarget.closest("[data-folder-id]").getAttribute("data-folder-id");

        await this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({ folderId }),
        });
    }

    async _handleClick_folderActorUnlink(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const folderId = evt.currentTarget.closest("[data-folder-id]").getAttribute("data-folder-id");

        await this._updateObject(null, {
            [`folders.${folderId}`]: {
                actorUuid: null,
            },
        });
    }

    async _handleClick_folderDelete(evt) {
        const folderId = evt.currentTarget.closest("[data-folder-id]").getAttribute("data-folder-id");

        await this._updateObject(null, {
            [`folders.-=${folderId}`]: null,

            ...this._handleClick_folderDelete_getEffectChanges({ evt, folderId }),
        });
    }

    _handleClick_folderDelete_getEffectChanges({ evt, folderId }) {
        const effectEntries = Object.entries(this._datamodel.effects).filter(
            ([, effect]) => effect.folderId === folderId,
        );

        // On SHIFT-click also delete all contained effects
        if (evt.shiftKey) {
            return Object.fromEntries(effectEntries.map(([id]) => [`effects.-=${id}`, null]));
        }

        // On regular click, move effects from the deleted folder to "uncategorized" effects
        return Object.fromEntries(effectEntries.map(([id]) => [`effects.${id}.folderId`, null]));
    }

    /* ----- */

    _handleChange_inputProxy(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const ele = evt.currentTarget;
        const name = ele.getAttribute("data-name-proxy");

        const eleInput = this.form.querySelector(`[name="${name}"]`);
        eleInput.value = ele.value;
        eleInput.dispatchEvent(
            new Event("change", {
                bubbles: true,
                cancelable: true,
            }),
        );
    }

    async _handleClick_playPreview(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        // Most macros need at least a source token. Ensure the user has one selected.
        const macroVariables = getMacroVariables();
        if (!macroVariables.sourceToken) return ui.notifications.warn("Please select a token first!");

        const effectId = evt.currentTarget.closest("[data-effect-id]").getAttribute("data-effect-id");

        const macro = await fromUuid(this._datamodel.effects[effectId].macroUuid);

        try {
            await macro.execute({});
        } catch (e) {
            console.error(e);

            // Many macros also require a target token. Prompt the user to select one if the macro failed.
            ui.notifications.warn("Macro failed to execute! You may have to target a token first.");
        }
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _onDragStart(evt) {
        evt.stopPropagation();

        const effectId = evt.currentTarget.closest("[data-effect-id]")?.getAttribute("data-effect-id");
        const folderId = evt.currentTarget.closest("[data-folder-id]")?.getAttribute("data-folder-id");

        if (!effectId) return;

        const dragData = {
            type: `${MODULE_ID}.folderize`,
            payload: {
                effectId,
                folderId,
            },
        };

        evt.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    async _onDrop(evt) {
        evt.stopPropagation();

        const data = TextEditor.getDragEventData(evt);

        if (data.lancerType) return this._onDrop_lancerFlow({ evt, data });

        const { type, payload } = data;

        switch (type) {
            case `${MODULE_ID}.folderize`:
                return this._onDrop_folderize({ evt, payload });

            case "Item":
                return this._onDrop_item({ evt, data });

            case "Macro":
                return this._onDrop_macro({ evt, data });

            case "Actor":
                return this._onDrop_actor({ evt, data });
        }
    }

    async _onDrop_lancerFlow({ evt, data }) {
        switch (data.lancerType) {
            case "frame": {
                return this._onDrop_lancerFlow_frame({ evt, data });
            }
        }
    }

    async _onDrop_lancerFlow_frame({ evt, data }) {
        const { flowType, uuid } = data;

        if (flowType !== "core_system.activation-flow") return;

        const eleEffect = evt.currentTarget.closest("[data-effect-id]");
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");

        const item = await fromUuid(uuid);
        if (!item) return;

        return this._createEffectFromDroppedItem({
            effectId: eleEffect?.getAttribute("data-effect-id"),
            folderId: eleFolder?.getAttribute("data-folder-id"),
            item,
        });
    }

    async _onDrop_folderize({ evt, payload }) {
        const dropTarget = evt.currentTarget.closest(
            `[data-drop-target="folder"], [data-drop-target="effects-uncategorized"]`,
        );
        if (!dropTarget) return;

        const dropTargetType = dropTarget.getAttribute("data-drop-target");

        const folderId = dropTargetType === "effects-uncategorized" ? null : dropTarget.getAttribute("data-folder-id");

        await this._updateObject(null, {
            [`effects.${payload.effectId}.folderId`]: folderId,
        });
    }

    async _onDrop_item({ evt, data }) {
        const eleEffect = evt.currentTarget.closest("[data-effect-id]");
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");
        const item = await fromUuid(data.uuid);

        if (!item) return;

        return this._createEffectFromDroppedItem({
            effectId: eleEffect?.getAttribute("data-effect-id"),
            folderId: eleFolder?.getAttribute("data-folder-id"),
            item,
        });
    }

    async _onDrop_macro({ evt, data }) {
        const eleEffect = evt.currentTarget.closest("[data-effect-id]");
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");
        const macro = await fromUuid(data.uuid);

        // If dropped to an existing row, update that row
        if (eleEffect) {
            const effectId = eleEffect.getAttribute("data-effect-id");

            return this._updateObject(null, {
                [`effects.${effectId}.macroUuid`]: macro.uuid,
            });
        }

        // Otherwise, create a new row
        const folderId = eleFolder ? eleFolder.getAttribute("data-folder-id") : null;
        return this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({
                macroUuid: macro.uuid,
                folderId,
            }),
        });
    }

    async _onDrop_actor({ evt, data }) {
        const eleFolder = evt.currentTarget.closest("[data-folder-id]");

        const actor = await fromUuid(data.uuid);

        // If dropped to an existing row, update that row
        if (eleFolder) {
            const folderId = eleFolder.getAttribute("data-folder-id");

            return this._updateObject(null, {
                [`folders.${folderId}.actorUuid`]: actor.uuid,
            });
        }

        // Otherwise, create a new row
        return this._updateObject(null, {
            [`folders.${foundry.utils.randomID()}`]: this._getNewFolder({
                actorUuid: actor.uuid,
            }),
        });
    }

    /* -------------------------------------------- */

    async _createEffectFromDroppedItem({ effectId, folderId, item }) {
        // If dropped to an existing row, update that row
        if (effectId) {
            if (item.system?.lid) {
                return this._updateObject(null, {
                    [`effects.${effectId}`]: {
                        mode: CUSTOM_EFFECT_MODE_LID,
                        itemLid: item.system.lid,
                    },
                });
            }

            return this._updateObject(null, {
                [`effects.${effectId}`]: {
                    mode: CUSTOM_EFFECT_MODE_NAME,
                    itemName: item.name,
                },
            });
        }

        // Otherwise, create a new row
        if (item.system?.lid) {
            return this._updateObject(null, {
                [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({
                    folderId,
                    mode: CUSTOM_EFFECT_MODE_LID,
                    itemLid: item.system.lid,
                }),
            });
        }

        return this._updateObject(null, {
            [`effects.${foundry.utils.randomID()}`]: this._getNewEffect({
                folderId,
                mode: CUSTOM_EFFECT_MODE_NAME,
                itemName: item.name,
            }),
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async _onChangeInput(evt) {
        // Do not fire change events for non-"state" inputs
        if (
            evt.currentTarget?.getAttribute("data-name-transient") ||
            evt.currentTarget?.getAttribute("data-name-proxy")
        ) {
            evt.stopPropagation();
            return;
        }

        return super._onChangeInput(evt);
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(_ = null, formData = null) {
        if (!game.user.isGM) throw new Error("Should never occur!");

        formData ||= {};
        formData = foundry.utils.flattenObject(formData);

        // Re-type `.mode`s as integers
        Object.entries(formData)
            .filter(([k]) => k.endsWith(".mode"))
            .forEach(([k, v]) => (formData[k] = Number(v)));

        this._datamodel.updateSource(formData);

        await game.settings.set(MODULE_ID, SETTING_EFFECTS_MANAGER_STATE, this._datamodel.toObject());
    }

    /* -------------------------------------------- */

    _getNewEffect({ macroUuid, folderId, mode, itemName, itemLid } = {}) {
        return {
            macroUuid: macroUuid || null,
            folderId: folderId || null,
            mode: mode || CUSTOM_EFFECT_MODE_NAME,
            itemName: itemName || null,
            itemLid: itemLid || null,
        };
    }

    _getNewFolder({ name, actorUuid, isCollapsed } = {}) {
        return {
            name: name || null,
            actorUuid: actorUuid || null,
            isCollapsed: isCollapsed || false,
        };
    }
}
