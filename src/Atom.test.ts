/// <reference types="jest" />
import Atom from './Atom';
import { Lens, Fold } from 'monocle-ts';


interface IPerson {
    firstName: string;
    lastName: string;
    addresses: Address[];
}

type Address = {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: number;
};

class Person implements IPerson {
    firstName: string;
    lastName: string;
    addresses: Address[];

    constructor(person: IPerson) {
        this.firstName = person.firstName;
        this.lastName = person.lastName;
        this.addresses = person.addresses;
    }
}

const examplePerson = new Person({
    firstName: 'Daniel',
    lastName: 'Mason',
    addresses: [
        {
            streetAddress: '123 Austin St.',
            city: 'Austin',
            state: 'TX',
            zipCode: '78705',
            country: 'US',
            phoneNumber: 5126194587
        },
        {
            streetAddress: '123 Houston St.',
            city: 'Houston',
            state: 'TX',
            zipCode: '78705',
            country: 'US',
            phoneNumber: 5126194587
        }
    ]
});

describe('Atom', () => {
    test('gets data', () => {
        const atom = new Atom(examplePerson);
        const actual = atom.cursor().get('firstName');

        expect(actual).toBe('Daniel');
    });

    test('unwraps data', () => {
        const atom = new Atom(examplePerson);
        const actual = atom.cursor().unwrap();

        expect(actual).toBe(examplePerson);
    });

    test('performs updates to complex types', () => {
        const atom = new Atom(examplePerson);
        atom.cursor().update(x => ({ ...x, firstName: 'Steve' }));

        expect(atom.current.firstName).toBe('Steve');
    });

    test('performs leaf-level updates', () => {
        const atom = new Atom(examplePerson);
        atom.cursor().cursor('firstName').update(_ => 'Steve');

        expect(atom.current.firstName).toBe('Steve');
    });

    test('performs updates within arrays', () => {
        const atom = new Atom(examplePerson);
        atom
            .cursor()
            .indexedCursor<Address>('addresses')
            .cursorAt(0)
            .update(x => ({ ...x, streetAddress: '456 Austin St.' }));

        expect(atom.current.addresses[0].streetAddress).toBe('456 Austin St.');
    });

    test('performs nested updates within arrays', () => {
        const atom = new Atom(examplePerson);
        atom
            .cursor()
            .indexedCursor<Address>('addresses')
            .cursorAt(0)
            .cursor('streetAddress')
            .update(_ => '456 Austin St.');

        expect(atom.current.addresses[0].streetAddress).toBe('456 Austin St.');
    });

    test('handles nonexistent array indexes', () => {
        const atom = new Atom(examplePerson);
        const actual = atom
            .cursor()
            .indexedCursor<Address>('addresses')
            .cursorAt(2)
            .get('streetAddress');

        expect(actual).toBe(undefined);
    });

    test('throws when attempting to set a value at a nonexistent array index', () => {
        const atom = new Atom(examplePerson);
        const cursor = atom
            .cursor()
            .indexedCursor<Address>('addresses')
            .cursorAt(2)
            .cursor('streetAddress');

        expect(() => cursor.update(_ => '456 Austin St.')).toThrow(/attempted to update /);
    });

    test('maintains reference equality of unchanged subtrees', () => {
        const atom = new Atom(examplePerson);
        const expectedAddress = examplePerson.addresses[1];

        atom
            .cursor()
            .indexedCursor<Address>('addresses')
            .cursorAt(0)
            .cursor('streetAddress')
            .update(_ => '456 Austin St.');

        expect(expectedAddress === atom.current.addresses[1]).toBe(true);
    });
});
