import * as ts from "typescript"
import * as fs from "fs";
import * as path from "path"

export namespace TsCore
{
    export interface TsConfigFile
    {
        errors: ts.Diagnostic[];
        config?: any;
        fileName?: string;
        basePath?: string;
   }

    /** Does nothing. */
    export function noop( _?: {} | null | undefined ): void { } // tslint:disable-line no-empty

    /** Do nothing and return false */
    export function returnFalse(): false { return false; }

    /** Do nothing and return true */
    export function returnTrue(): true { return true; }

    /** Do nothing and return undefined */
    export function returnUndefined(): undefined { return undefined; }

    /** Returns its argument. */
    export function identity<T>( x: T ) { return x; }

    /** Returns lower case string */
    export function toLowerCase( x: string ) { return x.toLowerCase(); }

    /** Throws an error because a function is not implemented. */
    export function notImplemented(): never
    {
        throw new Error( "Not implemented" );
    }

    export function fileExtensionIs( path: string, extension: string ): boolean
    {
        let pathLen = path.length;
        let extLen = extension.length;
        return pathLen > extLen && path.substr( pathLen - extLen, extLen ) === extension;
    }

    export function fileExtensionIsOneOf( path: string, extensions: ReadonlyArray<string> ): boolean
    {
        for ( const extension of extensions )
        {
            if ( fileExtensionIs( path, extension ) )
            {
                return true;
            }
        }

        return false;
    }

    export const supportedExtensions = [".ts", ".tsx", ".d.ts"];

    export const moduleFileExtensions = supportedExtensions;

    export function isSupportedSourceFileName( fileName: string )
    {
        if ( !fileName ) { return false; }

        for ( let extension of supportedExtensions )
        {
            if ( fileExtensionIs( fileName, extension ) )
            {
                return true;
            }
        }

        return false;
    }

    export function createDiagnostic( message: ts.DiagnosticMessage, ...args: any[] ): ts.Diagnostic
    {
        let text = message.message;

        if ( arguments.length > 1 )
        {
            text = formatStringFromArgs( text, arguments, 1 );
        }

        return {
            file: undefined,
            start: undefined,
            length: undefined,
            messageText: text,
            category: message.category,
            code: message.code
        };
    }

    function formatStringFromArgs( text: string, args: any, baseIndex: number )
    {
        baseIndex = baseIndex || 0;
        return text.replace( /{(\d+)}/g, function ( match: any, index: any )
        {
            return args[+index + baseIndex];
        } );
    }

    export function normalizeSlashes( path: string ): string
    {
        return path.replace( /\\/g, "/" );
    }

    export function outputExtension( path: string ): string
    {
        return path.replace( /\.ts/, ".js" );
    }

    export function getConfigFileName( configFilePath: string ): string | undefined
    {
        try
        {
            var isConfigDirectory = fs.lstatSync( configFilePath ).isDirectory();
        }
        catch ( e )
        {
            return undefined;
        }

        if ( isConfigDirectory )
        {
            return path.join( configFilePath, "tsconfig.json" );
        }
        else
        {
            return configFilePath;
        }
    }

    /**
     * Parse standard project configuration objects: compilerOptions, files.
     * @param configFilePath
     */
    export function readConfigFile( configFilePath: string ): TsCore.TsConfigFile
    {
        let configFileName = TsCore.getConfigFileName( configFilePath );

        if ( !configFileName )
        {
            let diagnostic = TsCore.createDiagnostic(
                {
                    code: 6064,
                    category: ts.DiagnosticCategory.Error,
                    key: "Cannot_read_project_path_0_6064",
                    message: "Cannot read project path '{0}'."
                }, configFilePath );

            return {
                errors: [diagnostic]
            }
        }

        let readConfigResult = ts.readConfigFile( configFileName, ( fileName ) =>
        {
            return ts.sys.readFile( fileName );
        } );

        if ( readConfigResult.error )
        {
            return {
                errors: [readConfigResult.error]
            };
        }

        let fullFileName = path.resolve( configFileName );

        return {
            fileName: fullFileName,
            basePath: path.dirname( fullFileName ),
            config: readConfigResult.config,
            errors: [],
        }
    }

    export function getProjectConfig( configFilePath: string ): ts.ParsedCommandLine
    {
        let configFile = readConfigFile( configFilePath );

        if ( configFile.errors.length > 0 )
        {
            return {
                options: undefined,
                fileNames: [],
                errors: configFile.errors
            }
        }

        return ts.parseJsonConfigFileContent( configFile.config, ts.sys, configFile.basePath, undefined, configFile.fileName );
    }
}