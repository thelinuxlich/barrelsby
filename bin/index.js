#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barrelsby = void 0;
const builder_1 = require("./builder");
const destinations_1 = require("./destinations");
const fileTree_1 = require("./fileTree");
const barrelName_1 = require("./options/barrelName");
const baseUrl_1 = require("./options/baseUrl");
const logger_1 = require("./options/logger");
const noSemicolon_1 = require("./options/noSemicolon");
const quoteCharacter_1 = require("./options/quoteCharacter");
const rootPath_1 = require("./options/rootPath");
const purge_1 = require("./purge");
// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function Barrelsby(args) {
    var _a, _b, _c, _d;
    // Get the launch options/arguments.
    const logger = (0, logger_1.getLogger)({ isVerbose: (_a = args.verbose) !== null && _a !== void 0 ? _a : false });
    const barrelName = (0, barrelName_1.getBarrelName)((_b = args.name) !== null && _b !== void 0 ? _b : '', logger);
    const directories = !Array.isArray(args.directory) ? [(_c = args.directory) !== null && _c !== void 0 ? _c : './'] : (_d = args.directory) !== null && _d !== void 0 ? _d : ['./'];
    logger.debug(`Directories passed`, directories);
    const resolvedDirectories = directories.map(directory => {
        const rootPath = (0, rootPath_1.resolveRootPath)(directory);
        logger.debug('Resolved root path %s', rootPath);
        return {
            dir: directory,
            rootPath,
            baseUrl: (0, baseUrl_1.getCombinedBaseUrl)(rootPath, args.baseUrl),
        };
    });
    logger.debug('resolved directories list', resolvedDirectories);
    resolvedDirectories.forEach(({ rootPath, baseUrl }) => __awaiter(this, void 0, void 0, function* () {
        var _e, _f;
        // Build the directory tree.
        const rootTree = (0, fileTree_1.buildTree)(rootPath, barrelName, logger);
        logger.debug(`root tree for path: ${rootPath}`, rootTree);
        // Work out which directories should have barrels.
        const destinations = (0, destinations_1.getDestinations)(rootTree, args.location, barrelName, logger);
        logger.debug('Destinations', destinations);
        // Potentially there are some existing barrels that need removing.
        (0, purge_1.purge)(rootTree, (_e = args.delete) !== null && _e !== void 0 ? _e : false, (_f = args.noHeader) !== null && _f !== void 0 ? _f : false, barrelName, logger);
        // Create the barrels.
        const quoteCharacter = (0, quoteCharacter_1.getQuoteCharacter)(args.singleQuotes);
        const semicolonCharacter = (0, noSemicolon_1.getSemicolonCharacter)(args.noSemicolon);
        // Add header to each barrel if the `noHeader` option is not true
        const addHeader = args.noHeader === false;
        yield (0, builder_1.build)({
            addHeader,
            destinations,
            quoteCharacter,
            semicolonCharacter,
            barrelName,
            logger,
            baseUrl,
            exportDefault: !!args.exportDefault,
            fullPathname: !!args.fullPathname,
            structure: args.structure,
            local: !!args.local,
            include: [].concat(args.include || []),
            exclude: [].concat(args.exclude || [], ['node_modules']),
        });
    }));
}
exports.Barrelsby = Barrelsby;
//# sourceMappingURL=index.js.map