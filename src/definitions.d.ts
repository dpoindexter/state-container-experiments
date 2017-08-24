declare module 'immutable-cursor' {
    import { Collection, Record } from 'immutable';

    type Key = string | number | symbol;

    type KeyPath = Array<string | number | symbol>;

    type Primitive = string | number | boolean | symbol | undefined | null;

    type ImmutableCollection =
        | Collection.Indexed<any>
        | Collection.Keyed<any, any>;

    interface Cursor<T> {
        deref(notSetValue?: T): T;

        get<TChild extends Record.Instance<any>, TChildValues>(
            key: any
        ): RecordCursor<
            TChildValues,
            Record.Instance<TChildValues> & Readonly<TChildValues>
        >;
        get<TChild extends ImmutableCollection>(
            key: any,
            notSetValue?: TChild
        ): Cursor<TChild>;
        get<TChild extends Primitive>(key: any, notSetValue?: TChild): TChild;

        cursor<TChild extends Record.Instance<any>, TChildValues>(
            key: any
        ): RecordCursor<
            TChildValues,
            Record.Instance<TChildValues> & Readonly<TChildValues>
        >;
        cursor<TChild extends ImmutableCollection | Primitive>(
            key: any,
            notSetValue?: TChild
        ): Cursor<TChild>;
    }

    interface RecordCursor<TMembers, TValue extends Readonly<TMembers>> {
        deref(notSetValue?: TValue): TValue;

        get<TChild extends Record.Instance<any>, TChildValues>(
            key: keyof TMembers
        ): RecordCursor<
            TChildValues,
            Record.Instance<TChildValues> & Readonly<TChildValues>
        >;
        get<TChild extends ImmutableCollection>(
            key: keyof TMembers
        ): Cursor<TChild>;
        get<TChild extends Primitive>(key: keyof TMembers): TChild;

        cursor<TChild extends Record.Instance<any>, TChildValues>(
            key: keyof TMembers
        ): RecordCursor<
            TChildValues,
            Record.Instance<TChildValues> & Readonly<TChildValues>
        >;
        cursor<TChild extends ImmutableCollection | Primitive>(
            key: keyof TMembers,
            notSetValue?: TChild
        ): Cursor<TChild>;
    }

    export function from<T extends ImmutableCollection>(
        data: T,
        onChange?: (nextValue: T, prevValue?: T, keyPath?: KeyPath) => void
    ): Cursor<T>;

    export function from<T extends ImmutableCollection>(
        data: T,
        keyPath: KeyPath,
        onChange?: (nextValue: T, prevValue?: T, keyPath?: KeyPath) => void
    ): Cursor<T>;

    export function from<
        TMembers,
        TValue extends Record.Instance<TMembers> &
            Readonly<TMembers> = Record.Instance<TMembers> & Readonly<TMembers>
    >(
        data: TValue,
        onChange?: (
            nextValue: TValue,
            prevValue?: TValue,
            keyPath?: KeyPath
        ) => void
    ): RecordCursor<TMembers, TValue>;

    export function from<
        TMembers,
        TValue extends Record.Instance<TMembers> &
            Readonly<TMembers> = Record.Instance<TMembers> & Readonly<TMembers>
    >(
        data: TValue,
        keyPath: KeyPath,
        onChange?: (
            nextValue: TValue,
            prevValue?: TValue,
            keyPath?: KeyPath
        ) => void
    ): RecordCursor<TMembers, TValue>;
}
