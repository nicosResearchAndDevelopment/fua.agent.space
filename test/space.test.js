const
    expect             = require('expect'),
    {describe, test}   = require('mocha'),
    Space              = require('../src/space.js'),
    {name: identifier} = require('../package.json');

describe('agent.space', function () {

    test('basics', function () {
        expect(Space).toBeTruthy();
        expect(typeof Space).toBe('object');
        expect(Object.isFrozen(Space)).toBeTruthy();
        expect(global[identifier]).toBe(Space);
    });

    test('develop', async function () {
        console.log(Space);
    });

});
