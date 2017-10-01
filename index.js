'use strict';

const utils = require('./lib/utils');

const cache = {
    'default': {},
};

let current = 'default';

let type = function (type) {
    if (cache[type]) {
        current = type;
        return Promise.resolve();
    }
    return Promise.reject(`The information type does not exist`);
};

let register = function (type) {
    if (cache[type]) {
        return Promise.reject(`The information type already exists`);
    }
    cache[type] = {};
    return Promise.resolve();
};

let append = function (json) {
    if (typeof json !== 'object' || Array.isArray(json)) {
        return Promise.reject(`Append can only pass in one object`);
    }

    let target = cache[current];
    utils.deepCopyObject(target, json);
    return Promise.resolve();
};

let add = function (path, message) {
    let paths = path.split('.');

    let target = cache[current];
    paths.forEach((key, index) => {
        let next = paths[index + 1];
        if (!next) {
            target[key] = message;
            return;
        }
        let _t = target[key];
        if (parseInt(next) == next && !Array.isArray(_t)) {
            _t = target[key] = [];
        } else if (!_t || typeof _t !== 'object') {
            _t = target[key] = {};
        }

        target = _t;
    });
};

let get = function (path) {
    let paths = path.split('.');

    let target = cache[current];
    paths.forEach((key, index) => {
        if (target && typeof target === 'object' &&  key in target) {
            target = target[key];
        } else {
            target = '';
        }
    });

    return target;
};

exports.type = type;
exports.register = register;

exports.append = append;
exports.add = add;
exports.get = get;