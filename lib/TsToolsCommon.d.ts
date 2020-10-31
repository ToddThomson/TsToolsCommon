import * as ts from "typescript";
declare namespace Ast {
    type AnyImportOrExport = ts.ImportDeclaration | ts.ImportEqualsDeclaration | ts.ExportDeclaration;
    interface ContainerNode extends ts.Node {
        nextContainer?: ContainerNode;
    }
    const enum ContainerFlags {
        None = 0,
        IsContainer = 1,
        IsBlockScopedContainer = 2,
        IsControlFlowContainer = 4,
        IsFunctionLike = 8,
        IsFunctionExpression = 16,
        HasLocals = 32,
        IsInterface = 64,
        IsObjectLiteralOrClassExpressionMethod = 128
    }
    function modifierToFlag(token: ts.SyntaxKind): ts.ModifierFlags;
    function getExternalModuleName(node: AnyImportOrExport): ts.Expression | undefined;
    function getModifierFlagsNoCache(node: ts.Node): ts.ModifierFlags;
    function getIdentifierFromSymbol(symbol: ts.Symbol): ts.Identifier | undefined;
    function getSourceFileFromAnyImportExportNode(node: AnyImportOrExport, checker: ts.TypeChecker): ts.SourceFile | undefined;
    function getSourceFileOfNode(node: ts.Node): ts.SourceFile;
    function getSourceFileFromSymbol(symbol: ts.Symbol): ts.SourceFile;
    function getClassHeritageProperties(classNodeU: ts.Node, checker: ts.TypeChecker): ts.Symbol[];
    function getClassAbstractProperties(extendsClause: ts.HeritageClause, checker: ts.TypeChecker): ts.Symbol[];
    function getImplementsProperties(implementsClause: ts.HeritageClause, checker: ts.TypeChecker): ts.Symbol[];
    function getIdentifierUID(symbol: ts.Symbol): string;
    function getContainerFlags(node: ts.Node): ContainerFlags;
    function getImplementsClause(node: ts.Node): ts.HeritageClause;
    function getExtendsClause(node: ts.Node): ts.HeritageClause;
    function isAliasSymbolDeclaration(node: ts.Node): boolean;
    function isIdentifier(node: ts.Node): boolean;
    function isPrototypeAccessAssignment(expression: ts.Node): boolean;
    function isFunctionLike(node: ts.Node): node is ts.FunctionLike;
    function isFunctionLikeDeclarationKind(kind: ts.SyntaxKind): boolean;
    function isFunctionLikeKind(kind: ts.SyntaxKind): boolean;
    function isObjectLiteralOrClassExpressionMethod(node: ts.Node): node is ts.MethodDeclaration;
    function isInterfaceInternal(symbol: ts.Symbol): boolean;
    function isClassInternal(symbol: ts.Symbol): boolean;
    function isClassAbstract(classSymbol: ts.Symbol): boolean;
    function isKeyword(token: ts.SyntaxKind): boolean;
    function isNamespaceImport(node: ts.Node): boolean;
    function isPuncuation(token: ts.SyntaxKind): boolean;
    function isTrivia(token: ts.SyntaxKind): boolean;
    function isExportProperty(propertySymbol: ts.Symbol): boolean;
    function isExportContext(propertySymbol: ts.Symbol): boolean;
    function isAmbientContext(propertySymbol: ts.Symbol): boolean;
    function isAmbientModule(symbol: ts.Symbol): boolean;
    function isSourceCodeFile(file: ts.SourceFile): boolean;
    function isSourceCodeModule(symbol: ts.Symbol): boolean;
    function isAnyImportOrExport(node: ts.Node): node is AnyImportOrExport;
}
declare namespace TsCore {
    interface TsConfigFile {
        errors: ts.Diagnostic[];
        config?: any;
        fileName?: string;
        basePath?: string;
    }
    /** Does nothing. */
    function noop(_?: {} | null | undefined): void;
    /** Do nothing and return false */
    function returnFalse(): false;
    /** Do nothing and return true */
    function returnTrue(): true;
    /** Do nothing and return undefined */
    function returnUndefined(): undefined;
    /** Returns its argument. */
    function identity<T>(x: T): T;
    /** Returns lower case string */
    function toLowerCase(x: string): string;
    /** Throws an error because a function is not implemented. */
    function notImplemented(): never;
    function fileExtensionIs(path: string, extension: string): boolean;
    function fileExtensionIsOneOf(path: string, extensions: ReadonlyArray<string>): boolean;
    const supportedExtensions: string[];
    const moduleFileExtensions: string[];
    function isSupportedSourceFileName(fileName: string): boolean;
    function createDiagnostic(message: ts.DiagnosticMessage, ...args: any[]): ts.Diagnostic;
    function normalizeSlashes(path: string): string;
    function outputExtension(path: string): string;
    function getConfigFileName(configFilePath: string): string | undefined;
    /**
     * Parse standard project configuration objects: compilerOptions, files.
     * @param configFilePath
     */
    function readConfigFile(configFilePath: string): TsCore.TsConfigFile;
    function getProjectConfig(configFilePath: string): ts.ParsedCommandLine;
}
declare namespace Debug {
    function assert(condition: boolean, message?: string): void;
}
declare namespace Utils {
    function forEach<T, U>(array: ReadonlyArray<T> | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
    function contains<T>(array: T[], value: T): boolean;
    function hasProperty<T>(map: ts.MapLike<T>, key: string): boolean;
    function map<T, U>(array: T[], f: (x: T) => U): U[];
    function extend(first: any, second: any): any;
    function replaceAt(str: string, index: number, character: string): string;
}
export { Ast };
export { Debug };
export { TsCore };
export { Utils };
