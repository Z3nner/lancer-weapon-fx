import fs from "fs";
import path from "path";

export const getBuildPath = moduleId => {
    return process.env.NODE_ENV === "production"
        ? path.join("dist", moduleId)
        : path.join(
              JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "foundryconfig.json"), "utf-8")).path,
              "modules",
              moduleId,
          );
};
