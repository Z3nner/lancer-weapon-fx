export const bindHooks = () => {
    Hooks.once("sequencer.ready", () => {
        // Check if either free or Patreon JB2A module is installed and activated, otherwise return and display an error message.
        if (game.modules.get("jb2a_patreon")?.active || game.modules.get("JB2A_DnD5e")?.active) return;

        const message =
            "Lancer Weapon FX | You need either the Free or the Patreon version of JB2A installed and active for this module to work properly!";
        console.error(`${message} The free version can be found at: https://foundryvtt.com/packages/JB2A_DnD5e`);
        ui.notifications.error(message, { permanent: true, console: false });
    });
};
