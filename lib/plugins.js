'use strict';

const Topo = require('@hapi/topo');

const resolve = function (registrations) {

    const plugins = new Topo();

    for (const [name, plugin] of Object.entries(registrations)) {
        if (plugin.enabled === false) {
            continue;
        }

        plugins.add([plugin], { before: plugin.before, after: plugin.after, group: name });
    }

    return plugins.nodes;
};

module.exports = { resolve };
