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
Object.defineProperty(exports, "__esModule", { value: true });
const Destinations = __importStar(require("./destinations"));
const TestUtilities = __importStar(require("./testUtilities"));
const signale_1 = require("signale");
describe('destinations module has a', () => {
    describe('getDestinations function that', () => {
        let directory;
        let destinations;
        const barrelName = 'barrel.ts';
        const testMode = (mode, getExpectedDestinations) => {
            describe(`when in '${mode}' mode`, () => {
                let logged;
                let logger = new signale_1.Signale();
                let loggerSpy;
                beforeEach(() => {
                    logged = [];
                    logger = TestUtilities.mockLogger(logged);
                    loggerSpy = jest.spyOn(logger, 'debug');
                    destinations = Destinations.getDestinations(directory, mode, barrelName, logger);
                });
                it('should select the correct destinations', () => {
                    expect(destinations).toEqual(getExpectedDestinations());
                });
                it('should log useful information to the logger', () => {
                    expect(loggerSpy).toHaveBeenCalled();
                });
            });
        };
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        testMode('top', () => [directory]);
        testMode('below', () => directory.directories);
        testMode('all', () => [
            directory.directories[0].directories[0],
            directory.directories[0],
            directory.directories[1],
            directory,
        ]);
        testMode('replace', () => [directory]);
        testMode('branch', () => [directory.directories[0], directory]);
    });
});
//# sourceMappingURL=destinations.test.js.map