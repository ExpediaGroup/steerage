'use strict';

const Entries = require('entries');
const Shortstop = require('shortstop');
const Handlers = require('shortstop-handlers');
const Confidence = require('confidence');
const Promisify = require('./promisify');
const Async = require('./async');

const create = function ({ basedir, protocols }) {

    const defaultProtocols = {
        file:    Handlers.file(basedir),
        path:    Handlers.path(basedir),
        base64:  Handlers.base64(),
        env:     Handlers.env(),
        require: Handlers.require(basedir),
        exec:    Handlers.exec(basedir),
        glob:    Handlers.glob(basedir)
    };

    protocols = Object.assign(defaultProtocols, protocols);

    const resolver = Shortstop.create();
    const resolve = Promisify(resolver.resolve, resolver);

    for (const [key, value] of Entries(protocols)) {
        resolver.use(key, value);
    }

    return Async(function *(config, onconfig) {
        const resolved = yield resolve(config);
        const merged = onconfig ? yield onconfig(resolved) : resolved;
        const store = new Confidence.Store(merged);
        return store;
    });
};

module.exports = create;
