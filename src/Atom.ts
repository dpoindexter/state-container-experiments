import { Lens } from 'monocle-ts';

function replaceAtIndex<T>(index: number) {
    return (val: T, list: T[]) => {
        if (index >= list.length) {

        }
        return list.map((x, i) => (i === index ? val : x));
    };
}

function indexLens<T>(i: number) {
    return new Lens<T[], T>(x => x[i], replaceAtIndex(i));
}

interface ICursor<T> {
    unwrap(): T;
    update(updater: (val: T) => T): void;
}

interface IObjectCursor<T> extends ICursor<T> {
    get<K extends keyof T>(key: K): T[K];
    cursor<K extends keyof T>(key: K): IObjectCursor<T[K]>;
    indexedCursor<K extends keyof T>(key: K): IIndexedCursor<T[K]>;
}

interface IIndexedCursor<T> extends ICursor<T[]> {
    get(index: number): T;
    cursorAt(index: number): IObjectCursor<T>;
}

class BaseCursor<T> implements ICursor<T> {
    constructor(
        protected val: T,
        protected commit: (fn: (rootData: any) => any) => void,
        protected lens: Lens<any, T>
    ) {}

    unwrap(): T {
        return this.val;
    }

    update(updater: (newVal: T) => T): void {
        this.commit(rootData => this.lens.modify(updater, rootData));
    }

    protected makeObjectLens<K extends keyof T>(key: K): Lens<T, T[K]> {
        return this.lens.compose(
            new Lens<T, T[K]>(
                x => x[key],
                (newVal, collection) =>
                    Object.assign({}, collection, {
                        [<string | symbol>key]: newVal
                    }) as T
            )
        );
    }
}

class Cursor<T> extends BaseCursor<T> implements IObjectCursor<T> {
    get<K extends keyof T>(key: K): T[K] {
        return (this.val == null)
            ? this.val
            : this.val[key];
    }

    cursor<K extends keyof T>(key: K): IObjectCursor<T[K]> {
        return new Cursor(
            this.val[key],
            this.commit,
            this.makeObjectLens(key)
        );
    }

    indexedCursor<TCollectionType>(
        key: keyof T
    ): IIndexedCursor<TCollectionType> {
        // hacky casting. We have to assume the user passed in the right type such that
        // TCollectionType[] === T[K]
        const collection = <TCollectionType[]>(<any>this.val[key]);
        const lens = <Lens<T, TCollectionType[]>>(<any>this.makeObjectLens(
            key
        ));
        return new IndexedCursor(collection, this.commit, lens);
    }
}

class IndexedCursor<TCollectionType> extends BaseCursor<TCollectionType[]>
    implements IIndexedCursor<TCollectionType> {
    get(index: number) {
        return this.val[index];
    }

    cursorAt(index: number): IObjectCursor<TCollectionType> {
        return new Cursor<TCollectionType>(
            this.val[index],
            this.commit,
            this.makeArrayLens(index)
        );
    }

    protected makeArrayLens(
        index: number
    ): Lens<TCollectionType[], TCollectionType> {
        return this.lens.compose(indexLens<TCollectionType>(index));
    }
}

class Atom<T> {
    constructor(public current: T) {}

    cursor() {
        const updateCallback = (fn: (rootData: T) => T) => {
            this.current = fn(this.current);
        };
        const lens = new Lens<T, T>(x => x, (v, _) => v);
        return new Cursor(this.current, updateCallback, lens);
    }
}

export default Atom;
