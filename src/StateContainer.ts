import xs from 'xstream';
//import Immutable from 'immutable';
import { Cursor } from 'immutable/contrib/cursor';

type CursorStream = xs<Cursor>;
//type ImmutableStream = xs<Immutable.Collection<string | number, any>>;

type EffectsAccessors = {
    [key: string]: () => CursorStream;
};

// type EffectsSpec = {
//     [key: string]: (
//         state$: ImmutableStream,
//         effects: EffectsAccessors
//     ) => ImmutableStream;
// };

// type StateInitSpec = {
//     getInitialState: () => { [key: string]: any };
//     effects: EffectsSpec;
// };

// const StateContainer = {
//     create(init: StateInitSpec) {}
// };

export default {};
