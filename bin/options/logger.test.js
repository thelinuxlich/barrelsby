"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const signale_1 = require("signale");
describe('options/logger module has a', () => {
    describe('getLogger function that', () => {
        it('should get the correct logger', () => {
            // tslint:disable:no-console
            const verboseLogger = (0, logger_1.getLogger)({ isVerbose: true });
            expect(verboseLogger).toBeInstanceOf(signale_1.Signale);
            const silentLogger = (0, logger_1.getLogger)({ isVerbose: false });
            expect(silentLogger).toBeInstanceOf(signale_1.Signale);
            expect(silentLogger).toBeDefined();
            // tslint:enable:no-console
        });
    });
});
//# sourceMappingURL=logger.test.js.map