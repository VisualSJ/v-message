'use strict';

import * as utils from './utils';

interface MessageObject {
    [key: string]: string | MessageObject | (string | MessageObject)[];
}

export class Message {
    
    public map: {
        [lang: string]: MessageObject;
    } = {};

    private _language: string = '';

    /**
     * 注册一个消息类型
     * @param {string} type 
     */
    register (type: string) {
        this.map[type] = this.map[type] || {};
        if (!this._language) {
            this._language = type;
        }
    }

    /**
     * 切换一个消息类型
     * @param {string} type 
     */
    switchTo (type: string) {
        this._language = type;
    }

    /**
     * 传入一个对象，将对象内标注的元素全部加到 cache 内
     * @param object 
     * @param options 
     */
    append (object: MessageObject) {
        const current = this.map[this._language];
        if (!current) {
            throw new Error('The specified type may not exist.');
        }

        if (typeof object !== 'object' || Array.isArray(object)) {
            throw new Error(`Append can only pass in one object`);
        }
    
        utils.deepCopyObject(current, object);
    }

    /**
     * 传入一个对象，将对象内标注的元素全部剔除
     * @param object 
     * @param options 
     */
    subtract (object: MessageObject) {
        const current = this.map[this._language];
        if (!current) {
            throw new Error('The specified type may not exist.');
        }

        if (typeof object !== 'object' || Array.isArray(object)) {
            throw new Error(`Subtract can only pass in one object`);
        }

        utils.deepEliminateObject(current, object);
    }

    /**
     * 传入 key，建立相应的数据
     * @param key 
     * @param value 
     */
    add (key: string, value: MessageObject | string) {
        const current = this.map[this._language];
        if (!current) {
            throw new Error('The specified type may not exist.');
        }

        let data: MessageObject = current;
        const paths = key.split('.');
        const last = paths.pop() || '';
        paths.some((key) => {
            data[key] = data[key] || (isNaN(key as any - 0) ? {} : []);
            if (typeof data[key] === 'string') {
                return true;
            }
            data = data[key] as MessageObject;
        });
        if (data) {
            data[last] = value;
        }
    }

    /**
     * 传入 key，删除相应的数据
     * @param key 
     */
    remove (key: string) {
        const current = this.map[this._language];
        if (!current) {
            throw new Error('The specified type may not exist.');
        }
    
        let data: MessageObject | null = current;
        const paths = key.split('.');
        const last = paths.pop() || '';
        paths.some((key) => {
            if (data && typeof data === 'object' && key in data) {
                data = data[key] as MessageObject;
                return false;
            }
            data = null;
            return true;
        });
        if (data && typeof data === 'object' && last in data) {
            delete data[last];
        }
    }

    /**
     * 传入一个 key，查询对应的数据
     * @param {string} key 
     */
    query (key: string) {
        const current = this.map[this._language];
        if (!current) {
            return '';
        }

        let data: MessageObject = current;
        const paths = key.split('.');
        const last = paths.pop() || '';

        for (let i=0; i<paths.length; i++) {
            let key = paths[i];
            if (!data[key]) {
                return '';
            }
            data = data[key] as MessageObject;
        }
        return data ? data[last] || '' : '';
    }

    /**
     * 查询语言列表
     * @returns 
     */
    queryLanguages () {
        return Object.keys(this.map);
    }

    /**
     * 查询当前使用的语言
     * @returns 
     */
    queryLanguage () {
        return this._language;
    }
}
