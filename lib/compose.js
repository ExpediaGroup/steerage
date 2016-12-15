'use strict';

const Hapi = require('hapi');
const Topo = require('topo');
const Entries = require('entries');
const Async = require('./async');
const Promisify = require('./promisify');

const compose = Async(function *({ store, environment, hooks }) {
    const manifest = store.get('/', environment);
    const { server = {}, connections = {}, register = {} } = manifest;
    const onconnection = Promisify(hooks.connection);
    const onregister = Promisify(hooks.register);

    const _server = new Hapi.Server(server);

    _server.app.config = store;

    for (const [name, connection] of Entries(connections)) {
        if (connection.labels) {
            connection.labels.push(name);
        }
        else {
            connection.labels = [name];
        }

        _server.connection(onconnection ? yield onconnection(name, Object.assign(connection)) : connection);
    }

    const _plugins = new Topo();

    for (const [name, plugin] of Entries(register)) {
        if (plugin.enabled === false) {
            continue;
        }
        if (onregister) {
            plugin.options = yield onregister(name, Object.assign({}, plugin.options));
        }
        _plugins.add([plugin], { before: plugin.before, after: plugin.after, group: name });
    }

    for (const plugin of _plugins.nodes) {
        yield _server.register(plugin, { select: plugin.select });
    }

    return _server;
});

module.exports = compose;
