'use strict';

type IObject = { [key: string]: any };

/**
 * 深度复制
 * 在不影响传入 object 的情况下，将 obejct 内的数据，复制到 target 上
 * @param target 
 * @param object 
 */
export function deepCopyObject(target: IObject, object: IObject) {
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

/**
 * 深度消除
 * 在不影响 object 的清况下，将 object 内包含的数据从 target 内剔除
 * @param target 
 * @param object 
 */
export function deepEliminateObject(target: IObject, object: IObject) {
    Object.keys(object).forEach((key) => {
        if (Array.isArray(object[key])) {
            delete target[key];
        } else if (object[key] && typeof object[key] === 'object') {
            deepEliminateObject(target[key], object[key]);
            if (Object.keys(target[key]).length === 0) {
                delete target[key];
            }
        } else {
            delete target[key];
        }
    });
};
