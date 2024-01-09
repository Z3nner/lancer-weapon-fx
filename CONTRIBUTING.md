# Contributing

## Dev Setup

### Setup

This repository uses Node.js to provide tooling. Download and install the [latest runtime](https://nodejs.org/en).

Then, run the following:

```bash
npm install
```

### Creating and Editing Macros

The workflow for creating and editing macros is as follows:

- To create a new macro, run `npm run new-effect "My Weapon Name"`
- To edit an existing macro, edit the files in `packs_source/weaponfx.db/<macro name>.[js|json]`
- Then, compile the macro compendium with `npm run db:pack`

The `weaponfx` pack is the default. To create a macro in a different pack, use `--pack <packName>`, for example: `npm run new-effect "My Manual Name" -- --pack weaponfx_manual`

You can then copy the module files (or symlink the folder) into your Foundry modules directory to test in-game.
