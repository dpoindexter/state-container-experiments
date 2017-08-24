/// <reference types="jest" />
//import StateContainer from './StateContainer';

class StateContainer<T, D> {
    create: () => {};
}

type Address = {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: number;
};

interface IPerson {
    firstName: string;
    lastName: string;
    addresses: Address[];
}

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

describe('StateContainer', () => {
    test('should pass', () => expect(true).toBe(true));
});
