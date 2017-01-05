'use strict';

const Topo = require('topo');
const Entries = require('entries');
const Async = require('./async');
const Promisify = require('./promisify');
const Hoek = require('hoek');

const compose = Async(function *(server, { store, environment, hooks }) {
    const manifest = store.get('/', environment);
    const { connections = {}, register = {} } = manifest;
    const onconnection = Promisify(hooks.connection);
    const onregister = Promisify(hooks.register);
    const serverSettings = manifest.server || {};

    server.app.config = store;

    server.root.settings = Hoek.applyToDefaults(server.root.settings, serverSettings);
    server.root.settings.app = manifest;

    for (const [name, connection] of Entries(connections)) {
        if (connection.labels) {
            connection.labels.push(name);
        }
        else {
            connection.labels = [name];
        }

        server.root.connection(onconnection ? yield onconnection(name, Object.assign(connection)) : connection);
    }

    const _plugins = new Topo();

    for (const [name, registration] of Entries(register)) {
        const plugin = onregister ? yield onregister(name, Object.assign(registration)) : registration;

        if (plugin.enabled === false) {
            continue;
        }

        _plugins.add([plugin], { before: plugin.before, after: plugin.after, group: name });
    }

    for (const plugin of _plugins.nodes) {
        yield server.root.register(plugin, { select: plugin.select });
    }

    return server;
});

module.exports = compose;
