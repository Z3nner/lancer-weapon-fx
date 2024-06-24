import fs from "fs";
import path from "path";
import prettier from "prettier";
import { DIR_PACKS_SOURCE } from "../consts.mjs";

const _DEINDENT_LINE_STARTS = [".effect(", ".sound(", ".canvasPan(", ".play("];
const _INDENT = 4;

const getFilepath = fileInfo => path.join(fileInfo.path, fileInfo.name);

const getPrettierFormatted = async fileInfo => {
    const filepath = getFilepath(fileInfo);
    const opts = await prettier.resolveConfig(filepath, { editorconfig: true });
    return prettier.format(fs.readFileSync(filepath, "utf-8"), { ...opts, filepath });
};

async function main() {
    // When running via `lint-staged`, we are passed a list of file paths.
    // Otherwise, default to reading the packs source directory.
    const [, , ...filenames] = process.argv;

    const fileInfos = filenames?.length
        ? filenames.map(filename => ({
              isDirectory: () => false,
              name: path.basename(filename),
              path: path.dirname(filename),
          }))
        : fs.readdirSync(DIR_PACKS_SOURCE, { recursive: true, withFileTypes: true });

    for (const fileInfo of fileInfos) {
        if (fileInfo.isDirectory()) continue;

        console.log(`Formatting ${getFilepath(fileInfo)} ...`);

        if (path.extname(fileInfo.name) !== ".js") {
            fs.writeFileSync(getFilepath(fileInfo), await getPrettierFormatted(fileInfo), "utf-8");
            continue;
        }

        const jsFormatted = (await getPrettierFormatted(fileInfo))
            .split("\n")
            .map(line => {
                if (!_DEINDENT_LINE_STARTS.some(start => line.trim().startsWith(start))) return line;

                const lineTrimmedStart = line.trimStart();

                const curIndent = line.length - lineTrimmedStart.length;
                if (curIndent <= _INDENT) return lineTrimmedStart;

                return line.slice(_INDENT);
            })
            .join("\n");

        fs.writeFileSync(getFilepath(fileInfo), jsFormatted, "utf-8");
    }
}

await main();
