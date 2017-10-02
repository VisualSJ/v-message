'use strict';

const assert = require('assert');
const message = require('../index');

describe('message', () => {

    it('zh - en', () => {
        message.register('zh');
        message.register('en');

        message.type('zh');
        message.append({
            foo: { bar: 'zh' },
        });
        message.add('v.n', '_zh');

        message.type('en');
        message.append({
            foo: { bar: 'en' },
        });
        message.add('v.n', '_en');

        message.type('zh');
        assert.equal(message.get('foo.bar'), 'zh');
        assert.equal(message.get('v.n'), '_zh');
        assert.equal(message.get('v.n.a'), '');

        message.type('en');
        assert.equal(message.get('foo.bar'), 'en');
        assert.equal(message.get('v.n'), '_en');
        assert.equal(message.get('v.n.a'), '');
    });
});