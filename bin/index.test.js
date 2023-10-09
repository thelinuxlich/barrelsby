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
const Destinations = __importStar(require("./destinations"));
const FileTree = __importStar(require("./fileTree"));
const index_1 = require("./index");
const BarrelName = __importStar(require("./options/barrelName"));
const BaseUrl = __importStar(require("./options/baseUrl"));
const Logger = __importStar(require("./options/logger"));
const NoSemicolon = __importStar(require("./options/noSemicolon"));
const QuoteCharacter = __importStar(require("./options/quoteCharacter"));
const RootPath = __importStar(require("./options/rootPath"));
const Purge = __importStar(require("./purge"));
const sinon_1 = __importDefault(require("sinon"));
const Builder = __importStar(require("./builder"));
describe('main module', () => {
    let spySandbox;
    beforeEach(() => {
        spySandbox = sinon_1.default.createSandbox();
    });
    afterEach(() => {
        spySandbox.restore();
    });
    it('should co-ordinate the main stages of the application', () => {
        const args = {
            noHeader: false,
            baseUrl: './',
            delete: true,
            directory: ['testRootPath'],
            exclude: ['directory4'],
            exportDefault: false,
            fullPathname: false,
            include: ['directory2'],
            local: true,
            location: 'top',
            name: 'inputBarrelName',
            noSemicolon: true,
            singleQuotes: true,
            structure: 'flat',
            verbose: true,
        };
        const builtTree = { mock: 'built tree' };
        const buildTreeSpy = spySandbox.stub(FileTree, 'buildTree').returns(builtTree);
        const destinations = { mock: 'destinations' };
        const getDestinationsSpy = spySandbox.stub(Destinations, 'getDestinations').returns(destinations);
        const purgeSpy = spySandbox.stub(Purge, 'purge');
        const buildBarrelsSpy = jest.spyOn(Builder, 'build');
        const quoteCharacter = "'";
        const getQuoteCharacterSpy = spySandbox.stub(QuoteCharacter, 'getQuoteCharacter').returns(quoteCharacter);
        const semicolonCharacter = ';';
        const getSemicolonCharacterSpy = spySandbox.stub(NoSemicolon, 'getSemicolonCharacter').returns(semicolonCharacter);
        const signale = Logger.getLogger();
        const getLoggerSpy = spySandbox.stub(Logger, 'getLogger').returns(signale);
        const barrelName = 'barrel.ts';
        const getBarrelNameSpy = spySandbox.stub(BarrelName, 'getBarrelName').returns(barrelName);
        const rootPath = './directory';
        const resolveRootPathSpy = spySandbox.stub(RootPath, 'resolveRootPath').returns(rootPath);
        const baseUrl = 'https://base-url.com/src/directory';
        const getCombinedBaseUrlSpy = spySandbox.stub(BaseUrl, 'getCombinedBaseUrl').returns(baseUrl);
        (0, index_1.Barrelsby)(args);
        expect(getQuoteCharacterSpy.calledOnceWithExactly(true)).toBeTruthy();
        expect(getSemicolonCharacterSpy.calledOnceWithExactly(true)).toBeTruthy();
        expect(getLoggerSpy.calledOnceWithExactly({ isVerbose: true })).toBeTruthy();
        expect(getBarrelNameSpy.calledOnceWithExactly(args.name, signale)).toBeTruthy();
        expect(resolveRootPathSpy.calledWithExactly('testRootPath')).toBeTruthy();
        expect(getCombinedBaseUrlSpy.calledOnceWithExactly(rootPath, args.baseUrl)).toBeTruthy();
        expect(buildTreeSpy.calledOnceWithExactly(rootPath, barrelName, signale)).toBeTruthy();
        expect(getDestinationsSpy.calledOnceWithExactly(builtTree, args.location, barrelName, signale)).toBeTruthy();
        expect(purgeSpy.calledOnceWithExactly(builtTree, args.delete, args.noHeader, barrelName, signale)).toBeTruthy();
        expect(buildBarrelsSpy).toHaveBeenCalledWith({
            addHeader: true,
            destinations,
            quoteCharacter,
            semicolonCharacter,
            barrelName,
            logger: signale,
            baseUrl,
            exportDefault: args.exportDefault,
            fullPathname: args.fullPathname,
            structure: args.structure,
            local: args.local,
            include: args.include,
            exclude: [...args.exclude, 'node_modules'],
        });
    });
});
//# sourceMappingURL=index.test.js.map