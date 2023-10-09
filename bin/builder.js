"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasename = exports.buildImportPath = exports.build = void 0;
const path_1 = __importDefault(require("path"));
const options_1 = require("./options/options");
const utilities_1 = require("./utilities");
const BuildBarrel_1 = require("./tasks/BuildBarrel");
const build = (params) => {
    var _a;
    try {
        // Build the barrels.
        (_a = params === null || params === void 0 ? void 0 : params.destinations) === null || _a === void 0 ? void 0 : _a.forEach((destination) => {
            var _a;
            return (0, BuildBarrel_1.buildBarrel)({
                addHeader: params.addHeader,
                directory: destination,
                barrelType: (_a = params.structure) !== null && _a !== void 0 ? _a : options_1.StructureOption.FLAT,
                quoteCharacter: params.quoteCharacter,
                semicolonCharacter: params.semicolonCharacter,
                barrelName: params.barrelName,
                logger: params.logger,
                baseUrl: params.baseUrl,
                exportDefault: params.exportDefault,
                fullPathname: params.fullPathname,
                local: params.local,
                include: params.include,
                exclude: params.exclude,
            });
        });
    }
    catch (e) {
        // tslint:disable-next-line:no-console
        params.logger.error(e);
    }
};
exports.build = build;
/** Builds the TypeScript */
function buildImportPath(directory, target, baseUrl) {
    // If the base URL option is set then imports should be relative to there.
    const startLocation = baseUrl ? baseUrl : directory.path;
    const relativePath = path_1.default.relative(startLocation, target.path);
    // Get the route and ensure it's relative
    let directoryPath = path_1.default.dirname(relativePath);
    if (directoryPath !== '.') {
        directoryPath = `.${path_1.default.sep}${directoryPath}`;
    }
    // Strip off the .ts or .tsx from the file name.
    const fileName = getBasename(relativePath);
    // Build the final path string. Use posix-style seperators.
    const location = `${directoryPath}${path_1.default.sep}${fileName}`;
    const convertedLocation = (0, utilities_1.convertPathSeparator)(location);
    return stripThisDirectory(convertedLocation, baseUrl);
}
exports.buildImportPath = buildImportPath;
function stripThisDirectory(location, baseUrl) {
    return baseUrl ? location.replace(utilities_1.thisDirectory, '') : location;
}
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
function getBasename(relativePath) {
    const mayBeSuffix = ['.ts', '.tsx', '.d.ts'];
    let mayBePath = relativePath;
    mayBeSuffix.map(suffix => {
        const tmpPath = path_1.default.basename(relativePath, suffix);
        if (tmpPath.length < mayBePath.length) {
            mayBePath = tmpPath;
        }
    });
    // Return whichever path is shorter. If they're the same length then nothing was stripped.
    return mayBePath;
}
exports.getBasename = getBasename;
//# sourceMappingURL=builder.js.map