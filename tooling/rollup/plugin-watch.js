import { createFilter } from "@rollup/pluginutils";
import fs from "fs";
import path from "path";
import process from "process";
import chokidar from "chokidar";

const cwd = process.cwd();

export const pluginWatch = (options = {}) => {
    let plugin;
    const filter = createFilter(options.include ?? [], options.exclude ?? []);

    const handleFileChange = relativeFilePath => {
        const filePath = path.join(cwd, relativeFilePath);

        if (!filter(filePath)) return;

        const tempFileId = plugin.getWatchFiles().find(id => fs.existsSync(id));

        console.log(`Watching new file: ${filePath}`);
        plugin.addWatchFile(filePath);

        // Force an update to an existing watched file, to refresh the watch
        fs.writeFileSync(tempFileId, fs.readFileSync(tempFileId));
    };

    chokidar
        .watch(".", { ignoreInitial: true })
        .on("add", filePath => handleFileChange(filePath))
        .on("error", error => console.error(`Watcher error: ${error}`));

    return {
        name: "watch",
        buildStart() {
            plugin = this;

            const recurseAndWatch = src => {
                fs.readdirSync(src, { withFileTypes: true }).forEach(dirEntry => {
                    const filePath = path.join(dirEntry.parentPath, dirEntry.name);

                    if (!filter(filePath)) return;

                    const stats = fs.statSync(filePath);

                    if (stats.isFile()) return this.addWatchFile(filePath);

                    if (stats.isDirectory()) recurseAndWatch(filePath);
                });
            };
            recurseAndWatch(cwd);
        },
    };
};
