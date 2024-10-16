import { CUSTOM_EFFECT_MODE_LID, CUSTOM_EFFECT_MODE_NAME } from "./consts.js";

/* -------------------------------------------- */
/*  Schema                                      */
/* -------------------------------------------- */

export const schemaFolder = new foundry.data.fields.SchemaField({
    name: new foundry.data.fields.StringField({
        label: "Name",
    }),

    // TODO(v12) switch to `foundry.data.fields.DocumentUUIDField`
    actorUuid: new foundry.data.fields.StringField({
        type: "Actor",
        label: "lancer-weapon-fx.effectManager.fields.actorUuid.label",
        nullable: true,
    }),

    isCollapsed: new foundry.data.fields.BooleanField({
        initial: false,
    }),
});

export const schemaCustomEffect = new foundry.data.fields.SchemaField({
    // TODO(v12) switch to `foundry.data.fields.DocumentUUIDField`
    macroUuid: new foundry.data.fields.StringField({
        type: "Macro",
        label: "lancer-weapon-fx.effectManager.fields.macroUuid.label",
        nullable: true,
    }),

    // TODO(v12) switch to `foundry.data.fields.DocumentUUIDField`
    folderId: new foundry.data.fields.StringField({ nullable: true }),

    mode: new foundry.data.fields.NumberField({
        integer: true,
        choices: [CUSTOM_EFFECT_MODE_NAME, CUSTOM_EFFECT_MODE_LID],
        nullable: true,
        initial: CUSTOM_EFFECT_MODE_NAME,
    }),

    // region Fields specific to "name" mode
    itemName: new foundry.data.fields.StringField({
        label: "Item Name",
        nullable: true,
    }),
    // endregion

    // region Fields specific to "LID" mode
    itemLid: new foundry.data.fields.StringField({
        label: "Lancer ID",
        nullable: true,
    }),
    // endregion
});

/* -------------------------------------------- */
/*  Data Model                                  */
/* -------------------------------------------- */

/**
 * Notes:
 * - `effects` and `folders` should ideally either be `ArrayField`s or `EmbeddedCollectionField`s.
 *    `ArrayField` is unsuitable as it cannot be diff-updated, as Foundry (as of v11) does not implement specific
 *    update logic for `ArrayField`s and so updating the fields clobbers the data.
 *    `EmbeddedCollectionField` is unsuitable as it can only be used with `Document` subclasses, i.e. a `DataModel`
 *    with DB backing, and as we are not storing our state as a document in the DB, we therefore cannot use this
 *    field type.
 * - The above schemas (`schemaFolder`, `schemaCustomEffect`) cannot be used as part of the main `DataModel`, as there
 *   is no `"*" -> "datamodel"` field type. Instead, we implement validation (`validate`) using the sub-schemas to
 *   achieve the same effect.
 */
export class EffectManagerData extends foundry.abstract.DataModel {
    /** @override */
    static defineSchema() {
        return {
            effects: new foundry.data.fields.ObjectField({
                initial: () => ({}),
                validate: (value, options) => {
                    return (
                        Object.keys(value).every(id => id != null && id.trim()) &&
                        Object.values(value).every(obj => {
                            const isValid = schemaCustomEffect.validate(obj, options);
                            if (isValid === undefined) return true;
                            return isValid;
                        })
                    );
                },
            }),

            folders: new foundry.data.fields.ObjectField({
                initial: () => ({}),
                validate: (value, options) => {
                    return (
                        Object.keys(value).every(id => id != null && id.trim()) &&
                        Object.values(value).every(obj => {
                            const isValid = schemaFolder.validate(obj, options);
                            if (isValid === undefined) return true;
                            return isValid;
                        })
                    );
                },
            }),
        };
    }
}
