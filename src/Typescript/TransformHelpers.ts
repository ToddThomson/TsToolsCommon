import * as ts from "typescript"
import { TsCore } from "./Core"

export namespace Factory
{
    export const nullTransformationContext: ts.TransformationContext = {
        enableEmitNotification: TsCore.noop,
        enableSubstitution: TsCore.noop,
        endLexicalEnvironment: TsCore.returnUndefined,
        getCompilerOptions: TsCore.notImplemented,
        //getEmitHost: TsCore.notImplemented,
        //getEmitResolver: TsCore.notImplemented,
        hoistFunctionDeclaration: TsCore.noop,
        hoistVariableDeclaration: TsCore.noop,
        isEmitNotificationEnabled: TsCore.notImplemented,
        isSubstitutionEnabled: TsCore.notImplemented,
        onEmitNode: TsCore.noop,
        onSubstituteNode: TsCore.notImplemented,
        readEmitHelpers: TsCore.notImplemented,
        requestEmitHelper: TsCore.noop,
        resumeLexicalEnvironment: TsCore.noop,
        startLexicalEnvironment: TsCore.noop,
        suspendLexicalEnvironment: TsCore.noop,
        //addDiagnostic: TsCore.noop,
    }

    export function getDeepMutableClone<T extends ts.Node>( node: T ): T
    {
        // Recursively visit the clone nodes.
        const visitor: ts.Visitor = ( node: T ): ts.Node =>
        {
            if ( node )
            {
                node.parent = clone;
                node.pos = -1;
                node.end = -1;

                return ts.visitEachChild( node, visitor, nullTransformationContext );
            }

            return node;
        }

        const clone = ts.getMutableClone( node );
        clone.pos = -1;
        clone.end = -1;
        clone.parent = undefined;

        return ts.visitNode( node, visitor );// nullTransformationContext );
    }
}