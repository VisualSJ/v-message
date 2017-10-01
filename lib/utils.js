'use strict';

let deepCopyObject = function (target, object) {
    Object.keys(object).forEach((key) => {
        let value = object[key];
        if (Array.isArray(value)) {
            value = deepCopyObject([], value);
        } else if (value && typeof value === 'object') {
            value = deepCopyObject({}, value);
        }
        target[key] = value;
    });
    return target;
};

exports.deepCopyObject = deepCopyObject;