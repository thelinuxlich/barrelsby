"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const sinon_1 = __importDefault(require("sinon"));
const builder_1 = require("./builder");
const FileSystem = __importStar(require("./builders/fileSystem"));
const Flat = __importStar(require("./builders/flat"));
const Header = __importStar(require("./builders/header"));
const Modules = __importStar(require("./modules"));
const options_1 = require("./options/options");
const TestUtilities = __importStar(require("./testUtilities"));
const signale_1 = require("signale");
const BuildBarrelModule = __importStar(require("./tasks/BuildBarrel"));
// Gets a location from a list by name.
function getLocationByName(locations, name) {
    return locations.filter(location => location.name === name)[0];
}
describe('builder/builder module has a', () => {
    describe('buildBarrels function that', () => {
        let directory;
        let spySandbox;
        let loggerSpy;
        let builderSpy;
        const logger = new signale_1.Signale();
        const runBuilder = (structure) => {
            loggerSpy = spySandbox.spy(logger, 'debug');
            builderSpy = spySandbox.spy(BuildBarrelModule, 'buildBarrel');
            (0, builder_1.build)({
                addHeader: true,
                destinations: directory.directories,
                quoteCharacter: '"',
                semicolonCharacter: ';',
                barrelName: 'barrel.ts',
                logger,
                baseUrl: undefined,
                exportDefault: false,
                fullPathname: false,
                structure,
                local: false,
                include: [],
                exclude: [],
            });
        };
        beforeEach(() => {
            (0, mock_fs_1.default)(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            spySandbox = sinon_1.default.createSandbox();
            spySandbox.stub(FileSystem, 'buildFileSystemBarrel').returns('fileSystemContent');
            spySandbox.stub(Flat, 'buildFlatBarrel').returns('flatContent');
            spySandbox.stub(Modules, 'loadDirectoryModules').returns([]);
            spySandbox.stub(Header, 'addHeaderPrefix').callsFake((content) => `header: ${content}`);
        });
        afterEach(() => {
            mock_fs_1.default.restore();
            spySandbox.restore();
        });
        describe('uses the structure option and', () => {
            const testStructure = (structure, isFlat) => {
                runBuilder(structure);
                // TODO: Test arguments for barrel builder & loadDirectoryModules
                if (isFlat) {
                    sinon_1.default.assert.calledTwice(Flat.buildFlatBarrel);
                    sinon_1.default.assert.notCalled(FileSystem.buildFileSystemBarrel);
                }
                else {
                    sinon_1.default.assert.notCalled(Flat.buildFlatBarrel);
                    sinon_1.default.assert.calledTwice(FileSystem.buildFileSystemBarrel);
                }
            };
            it('should use the flat builder if in flat mode', () => {
                testStructure(options_1.StructureOption.FLAT, true);
            });
            it('should use the filesystem builder if in filesystem mode', () => {
                testStructure(options_1.StructureOption.FILESYSTEM, false);
            });
            it('should use the flat builder if no mode is specified', () => {
                testStructure(undefined, true);
            });
        });
        it("should write each barrel's header and content to disk", () => {
            runBuilder(options_1.StructureOption.FLAT);
            /*const checkContent = (address: string) => {
              const result = fs.readFileSync(address, 'utf8');
              expect(result).toEqual('header: flatContent');
            };
            checkContent('directory1/directory2/barrel.ts');
            checkContent('directory1/directory3/barrel.ts');*/
        });
        it('should update the directory structure with the new barrel', () => {
            runBuilder(options_1.StructureOption.FLAT);
            directory.directories.forEach((subDirectory) => {
                expect(subDirectory.barrel.name).toEqual('barrel.ts');
            });
        });
        it('should log useful information to the logger', () => {
            runBuilder(options_1.StructureOption.FLAT);
            const messages = [
                'Building barrel @ directory1/directory2',
                'Updating model barrel @ directory1/directory2/barrel.ts',
                'Building barrel @ directory1/directory3',
                'Updating model barrel @ directory1/directory3/barrel.ts',
            ];
            expect(loggerSpy.callCount).toEqual(4);
            messages.forEach((message, barrel) => {
                expect(loggerSpy.getCall(barrel).args[0]).toEqual(message);
            });
        });
        it('should run the amount of times as the directory options length', () => {
            runBuilder(options_1.StructureOption.FLAT);
            expect(builderSpy.callCount).toBe(directory.directories.length);
        });
    });
    describe('buildBarrels function with empty barrel content that', () => {
        let directory;
        let spySandbox;
        const logger = new signale_1.Signale();
        const runBuilder = () => {
            (0, builder_1.build)({
                addHeader: true,
                destinations: directory.directories,
                quoteCharacter: '"',
                semicolonCharacter: ';',
                barrelName: 'barrel.ts',
                logger,
                baseUrl: undefined,
                exportDefault: false,
                fullPathname: false,
                structure: options_1.StructureOption.FLAT,
                local: false,
                include: [],
                exclude: [],
            });
        };
        beforeEach(() => {
            (0, mock_fs_1.default)(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            spySandbox = sinon_1.default.createSandbox();
            spySandbox.stub(Flat, 'buildFlatBarrel').returns('');
            spySandbox.stub(Modules, 'loadDirectoryModules').returns([]);
        });
        afterEach(() => {
            mock_fs_1.default.restore();
            spySandbox.restore();
        });
        it('does not create an empty barrel', () => {
            runBuilder();
            const checkDoesNotExist = (address) => {
                expect(fs_1.default.existsSync(address)).toBe(false);
            };
            checkDoesNotExist('directory1/directory2/barrel.ts');
            checkDoesNotExist('directory1/directory3/barrel.ts');
        });
    });
    describe('buildImportPath function that', () => {
        let directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it('should correctly build a path to a file in the same directory', () => {
            const target = getLocationByName(directory.files, 'index.ts');
            const result = (0, builder_1.buildImportPath)(directory, target, undefined);
            expect(result).toEqual('./index');
        });
        it('should correctly build a path to a file in a child directory', () => {
            const childDirectory = getLocationByName(directory.directories, 'directory2');
            const target = getLocationByName(childDirectory.files, 'script.ts');
            const result = (0, builder_1.buildImportPath)(directory, target, undefined);
            expect(result).toEqual('./directory2/script');
        });
    });
    describe('getBasename function that', () => {
        it('should correctly strip .ts from the filename', () => {
            const fileName = './random/path/file.ts';
            const result = (0, builder_1.getBasename)(fileName);
            expect(result).toEqual('file');
        });
        it('should correctly strip .d.ts from the filename', () => {
            const fileName = './random/path/file.d.ts';
            const result = (0, builder_1.getBasename)(fileName);
            expect(result).toEqual('file');
        });
        it('should correctly strip .tsx from the filename', () => {
            const fileName = './random/path/file.tsx';
            const result = (0, builder_1.getBasename)(fileName);
            expect(result).toEqual('file');
        });
        it('should not strip extensions from non-typescript filenames', () => {
            const fileName = './random/path/file.cs';
            const result = (0, builder_1.getBasename)(fileName);
            expect(result).toEqual('file.cs');
        });
    });
});
//# sourceMappingURL=builder.test.js.map