/// <reference types="./definitions.d.ts" />
import * as Cursor from 'immutable-cursor';
import { Record, List } from 'immutable';

interface AddressValues {
    streetAddress: string;
};

type Address = Record.Instance<AddressValues> & Readonly<AddressValues>;
const AddressRecord = Record<AddressValues>({
    streetAddress: ''
});


interface PersonValues {
    firstName: string;
    lastName: string;
    primaryAddress: Address;
    addresses: List<Address>;
};

type Person = Record.Instance<PersonValues> & Readonly<PersonValues>;
const PersonRecord = Record<PersonValues>({
    firstName: '',
    lastName: '',
    primaryAddress: AddressRecord(),
    addresses: List.of()
});

const person = PersonRecord({
    firstName: 'Daniel',
    lastName: 'Poindexter',
    addresses: List.of(
        AddressRecord({
            streetAddress: '5708 Highland Hills Circle'
        })
    )
});

const cursor = Cursor.from<PersonValues>(person);
const val = cursor.get<string>('firstName');
const nestedRecord = cursor.get<Address, AddressValues>('primaryAddress');
const val2 = cursor.cursor<List<Address>>('addresses').cursor<Address, AddressValues>(0);


