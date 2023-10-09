import { BaseUrl } from './options/baseUrl';
import { Logger } from './options/logger';
import { SemicolonCharacter } from './options/noSemicolon';
import { StructureOption } from './options/options';
import { QuoteCharacter } from './options/quoteCharacter';
import { Directory } from './interfaces/directory.interface';
import { FileTreeLocation } from './interfaces/location.interface';
export declare const build: (params: {
    addHeader: boolean;
    destinations: Directory[];
    quoteCharacter: QuoteCharacter;
    semicolonCharacter: SemicolonCharacter;
    barrelName: string;
    logger: Logger;
    baseUrl: BaseUrl;
    exportDefault: boolean;
    fullPathname: boolean;
    structure: StructureOption | undefined;
    local: boolean;
    include: string[];
    exclude: string[];
}) => void;
export type BarrelBuilder = (directory: Directory, modules: FileTreeLocation[], quoteCharacter: QuoteCharacter, semicolonCharacter: SemicolonCharacter, logger: Logger, baseUrl: BaseUrl, exportDefault: boolean) => string;
/** Builds the TypeScript */
export declare function buildImportPath(directory: Directory, target: FileTreeLocation, baseUrl: BaseUrl): string;
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export declare function getBasename(relativePath: string): string;
