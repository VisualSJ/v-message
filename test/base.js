'use strict';

const assert = require('assert');
const { Message } = require('../dev/message');

describe('base', () => {

    it('register 后的默认语言', () => {
        const message = new Message();
        message.register('zh');

        const language = message.queryLanguage();
        assert.equal(language, 'zh');
    });

    it('register 后的语言列表', () => {
        const message = new Message();
        message.register('zh');
        message.register('en');

        const list = message.queryLanguages();
        assert.deepEqual(list, ['zh', 'en']);
    });

    it('switch 切换语言', () => {
        const message = new Message();
        message.register('zh');
        message.register('en');
        let language;

        message.switchTo('en');
        language = message.queryLanguage();
        assert.equal(language, 'en');

        message.switchTo('zh');
        language = message.queryLanguage();
        assert.equal(language, 'zh');
    });

    it('add 新增数据', () => {
        const message = new Message();
        message.register('zh');
        message.register('en');
        let msg = '';

        message.add('a.b', 'a');
        msg = message.query('a.b');
        assert.equal(msg, 'a');

        message.add('a.0', 'b');
        msg = message.query('a.0');
        assert.equal(msg, 'b');

        message.add('a', 'c');
        msg = message.query('a');
        assert.equal(msg, 'c');
    });

    it('append 追加数据', () => {
        const message = new Message();
        message.register('zh');
        message.register('en');
        let msg = '';

        msg = message.query('foo.bar');
        assert.equal(msg, '');
        message.append({
            foo: {
                bar: 'zh',
            },
        });
        msg = message.query('foo.bar');
        assert.equal(msg, 'zh');

        message.switchTo('en');
        msg = message.query('foo.bar');
        assert.equal(msg, '');
        message.append({
            foo: {
                bar: 'en',
            },
        });
        msg = message.query('foo.bar');
        assert.equal(msg, 'en');

        message.switchTo('zh');
        msg = message.query('foo.bar');
        assert.equal(msg, 'zh');
    });

    it('subtract 裁剪数据', () => {
        const message = new Message();
        message.register('zh');
        message.register('en');
        message.append({
            foo: {
                bar: 'zh',
                bar2: 'en',
            },
            test: '',
        });

        message.subtract({
            foo: {
                bar: 'en',
            },
        });
        message.remove('test');

        assert.equal(message.query('foo.bar'), '');
        assert.equal(message.query('foo.bar2'), 'en');
        assert.equal(message.query('test'), '');
    });

});
