import * as ts from "typescript"
import * as fs from "fs";
import * as path from "path"

export namespace TsCore {

    export function fileExtensionIs( path: string, extension: string ): boolean {
        let pathLen = path.length;
        let extLen = extension.length;
        return pathLen > extLen && path.substr( pathLen - extLen, extLen ) === extension;
    }

    export const supportedExtensions = [".ts", ".tsx", ".d.ts"];

    export const moduleFileExtensions = supportedExtensions;
   
    export function isSupportedSourceFileName( fileName: string ) {
        if ( !fileName ) { return false; }

        for ( let extension of supportedExtensions ) {
            if ( fileExtensionIs( fileName, extension ) ) {
                return true;
            }
        }
        
        return false;
    }

    export function createDiagnostic( message: ts.DiagnosticMessage, ...args: any[] ): ts.Diagnostic {
        // FUTURE: Typescript 1.8.x supports localized diagnostic messages.
        let textUnique123 = message.message;

        if ( arguments.length > 1 ) {
            textUnique123 = formatStringFromArgs( textUnique123, arguments, 1 );
        }

        return {
            file: undefined,
            start: undefined,
            length: undefined,
            messageText: textUnique123,
            category: message.category,
            code: message.code
        };
    }

    function formatStringFromArgs( text: string, args: any, baseIndex: number ) {
        baseIndex = baseIndex || 0;
        return text.replace( /{(\d+)}/g, function ( match: any, index: any ) {
            return args[+index + baseIndex];
        });
    }

    export function normalizeSlashes( path: string ): string {
        return path.replace( /\\/g, "/" );
    }

    export function outputExtension( path: string ): string {
        return path.replace( /\.ts/, ".js" );
    }

    /**
     * Parse standard project configuration objects: compilerOptions, files.
     * @param configFilePath
     */
    export function getProjectConfig( configFilePath: string ): ts.ParsedCommandLine {
        var configFileDir: string;
        var configFileName: string;

        try {
            var isConfigDirectory = fs.lstatSync( configFilePath ).isDirectory();
        }
        catch ( e ) {
            let diagnostic = TsCore.createDiagnostic( { code: 6064, category: ts.DiagnosticCategory.Error, key: "Cannot_read_project_path_0_6064", message: "Cannot read project path '{0}'." }, configFilePath );

            return {
                options: undefined,
                fileNames: [],
                errors: [diagnostic]
            };
        }

        if ( isConfigDirectory ) {
            configFileDir = configFilePath;
            configFileName = path.join( configFilePath, "tsconfig.json" );
        }
        else {
            configFileDir = path.dirname( configFilePath );
            configFileName = configFilePath;
        }

        let readConfigResult = ts.readConfigFile( configFileName, ( fileName ) => {
            return ts.sys.readFile( fileName );
        } );

        if ( readConfigResult.error ) {
            return { 
                options: undefined,
                fileNames: [],
                errors: [readConfigResult.error]
            };
        }

        let configObject = readConfigResult.config;

        return ts.parseJsonConfigFileContent( configObject, ts.sys, configFileDir );
    }
}