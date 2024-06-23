// Based on Foundry's `foundry.utils.randomID`
const _FOUNDRY_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const getFoundryId = () => {
    return Array.from(
        new Array(16),
        () => _FOUNDRY_ID_CHARS[Math.floor(Math.random() * _FOUNDRY_ID_CHARS.length)],
    ).join("");
};

// Based on Foundry's `CONST.IMAGE_FILE_EXTENSIONS`
const _FOUNDRY_IMAGE_FILE_EXTENSIONS = new Set([
    "apng",
    "avif",
    "bmp",
    "gif",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "tiff",
    "webp",
]);
export const isValidFoundryImage = str => {
    return _FOUNDRY_IMAGE_FILE_EXTENSIONS.has(
        str
            .split(".")
            .map(it => it.trim())
            .filter(Boolean)
            .at(-1),
    );
};

// Based on Foundry CLI's `getSafeFilename`
// See: https://github.com/foundryvtt/foundryvtt-cli/blob/c9d14019147997dc7f45382dc8f6842f66aa3f5d/lib/package.mjs#L546
export const getSafeFilename = filename => {
    return filename.replace(/[^a-zA-Z0-9А-я]/g, "_");
};
