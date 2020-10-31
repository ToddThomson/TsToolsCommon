import * as ts from "typescript";

export namespace Utils
{
    export function forEach<T, U>( array: ReadonlyArray<T> | undefined, callback: ( element: T, index: number ) => U | undefined ): U | undefined
    {
        if ( array )
        {
            for ( let i = 0, len = array.length; i < len; i++ )
            {
                let result = callback( array[i], i );
                if ( result )
                {
                    return result;
                }
            }
        }

        return undefined;
    }

    export function contains<T>( array: T[], value: T ): boolean
    {
        if ( array )
        {
            for ( let v of array )
            {
                if ( v === value )
                {
                    return true;
                }
            }
        }

        return false;
    }

    let hasOwnProperty = Object.prototype.hasOwnProperty;

    export function hasProperty<T>( map: ts.MapLike<T>, key: string ): boolean
    {
        return hasOwnProperty.call( map, key );
    }

    export function map<T, U>( array: T[], f: ( x: T ) => U ): U[]
    {
        let result: U[];
        if ( array )
        {
            result = [];
            for ( let v of array )
            {
                result.push( f( v ) );
            }
        }

        return result;
    }

    export function extend( first: any, second: any ): any
    {
        let result: any = {};

        for ( let id in first )
        {
            ( result as any )[id] = first[id];
        }
        for ( let id in second )
        {
            if ( !hasProperty( result, id ) )
            {
                ( result as any )[id] = second[id];
            }
        }
        return result;
    }

    export function replaceAt( str: string, index: number, character: string )
    {
        return str.substr( 0, index ) + character + str.substr( index + character.length );
    }
}