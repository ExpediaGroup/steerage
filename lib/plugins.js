'use strict';

const Topo = require('topo');

const getPlugin = function (plugin) {
    return {
        plugin: plugin.plugin.plugin,
        options: plugin.options ? plugin.options : {}
    };
};

const resolve = function (registrations) {
    const plugins = new Topo();

    for (const [name, plugin] of Object.entries(registrations)) {
        if (plugin.enabled === false) {
            continue;
        }
        plugins.add([getPlugin(plugin)], { before: plugin.before, after: plugin.after, group: name });
    }

    return plugins.nodes;
};

module.exports = { resolve };
