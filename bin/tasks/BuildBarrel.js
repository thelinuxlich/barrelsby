"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBarrel = void 0;
const utilities_1 = require("../utilities");
const modules_1 = require("../modules");
const path_1 = __importDefault(require("path"));
const header_1 = require("../builders/header");
const fs_1 = __importDefault(require("fs"));
const fileSystem_1 = require("../builders/fileSystem");
const flat_1 = require("../builders/flat");
const options_1 = require("../options/options");
const buildBarrel = ({ addHeader, directory, barrelType, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, exportDefault, fullPathname, local, include, exclude, }) => {
    logger.debug(`Building barrel @ ${directory.path}`);
    let content = '';
    if (barrelType === options_1.StructureOption.FILESYSTEM) {
        content = (0, fileSystem_1.buildFileSystemBarrel)(directory, (0, modules_1.loadDirectoryModules)(directory, logger, include, exclude, local), quoteCharacter, semicolonCharacter, logger, baseUrl);
    }
    else if (barrelType === options_1.StructureOption.FLAT) {
        content = (0, flat_1.buildFlatBarrel)(directory, (0, modules_1.loadDirectoryModules)(directory, logger, include, exclude, local), quoteCharacter, semicolonCharacter, logger, baseUrl, exportDefault, fullPathname);
    }
    else {
        throw new Error('No barrel type provided... this is likely a code error');
    }
    const destination = path_1.default.join(directory.path, barrelName);
    if (content.length === 0) {
        // Skip empty barrels.
        return;
    }
    // Add the header
    const contentWithHeader = addHeader ? (0, header_1.addHeaderPrefix)(content) : content;
    fs_1.default.writeFileSync(destination, contentWithHeader);
    // Update the file tree model with the new barrel.
    if (!directory.files.some(file => file.name === barrelName)) {
        const convertedPath = (0, utilities_1.convertPathSeparator)(destination);
        const barrel = {
            name: barrelName,
            path: convertedPath,
        };
        logger.debug(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
};
exports.buildBarrel = buildBarrel;
//# sourceMappingURL=BuildBarrel.js.map