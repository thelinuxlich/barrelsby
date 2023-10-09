import { Options } from 'yargs';
export type LocationOption = 'top' | 'below' | 'all' | 'replace' | 'branch';
export declare enum StructureOption {
    FLAT = "flat",
    FILESYSTEM = "filesystem"
}
export interface Arguments {
    [x: string]: unknown;
    baseUrl?: string;
    config?: string;
    directory?: string[] | string;
    delete?: boolean;
    exclude?: string[];
    exportDefault?: boolean;
    noHeader?: boolean;
    help?: boolean;
    include?: string[];
    local?: boolean;
    location?: LocationOption;
    name?: string;
    noSemicolon?: boolean;
    singleQuotes?: boolean;
    structure?: StructureOption;
    version?: boolean;
    verbose?: boolean;
}
export declare function getOptionsConfig(configParser: any): {
    [key: string]: Options;
};
