# Contributing

## Dev Setup

### Setup

This repository uses Node.js to provide tooling. Download and install the [latest runtime](https://nodejs.org/en).

Then, copy `example.foundryconfig.json` to `foundryconfig.json` and edit the `"path"` to point to your Foundry `Data` folder (the folder which contains `modules/`, `systems/`, and `worlds/`).

Then, run the following:

```bash
npm clean-install
npm run build
```

This will watch for file changes in the project, and copy them to your Foundry data folder. For CSS and Handlebars files, Foundry's "hot reload" is used, so your changes will be applied without refreshing. 

Press `CTRL+C` to quit.

⚠️ This module includes compendiums, which are locked when a world is active. Return to Foundry's `/setup` page before running `npm run build`. ⚠️

### Creating and Editing Macros

The workflow for creating and editing macros is as follows:

- To create a new macro, run `npm run new-effect "My Weapon Name"`
- To edit an existing macro, edit the files in `packs_source/weaponfx/<folder name>/<macro name>.[js|json]`

The "Effects" folder is the default. To create a macro in a different pack, use `--type <type>`, for example: `npm run new-effect "My Manual Name" -- --type manual`. Use `npm run new-effect -- --help` for more information.

### Testing Macros

First, compile the macro compendium with `npm run db:pack`. You can then copy the module files (or symlink the folder) into your Foundry modules directory to test in-game.

Note that may have to return to the setup screen in order for Foundry to unlock the compendium database files, and allow them to be overwritten.
