import { assert, expect, test, describe, it } from 'vitest'
import VarConv from './src/var-conv.js'

const inputs = [
    'my-variable-name',
    'My-Variable-Name',
    'my-Variable-Name',
    'MY-Variable-nAME',

    'my_variable_name',
    'my_Variable_Name',
    'MY_Variable_nAME',

    'MY_Variable-nAME',
    'MY/Variable\\nAME',

    'MY_VARIABLE_NAME',

    'MyVariableName',
    'myVariableName',
]


describe('Split Input String', () => {
    inputs.forEach((input) => {
        it(`Split Input String: ${input}`, () => {
            let vc = new VarConv(input);

            console.log(vc);

            expect(vc.var_split).toEqual(['my', 'variable', 'name']);
        });
    })

});









