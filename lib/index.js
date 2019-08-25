'use strict';

const Pkg = require('../package.json');
const Plugins = require('./plugins');
const Config = require('./config');
const Path = require('path');
const Joi = require('@hapi/joi');
const Props = require('dot-prop');
const Hapi = require('@hapi/hapi');

const schema = Joi.object({
    basedir: Joi.string().allow(null),
    config: Joi.string().required(),
    onconfig: Joi.func().allow(null),
    protocols: Joi.object().default(),
    environment: Joi.object().default({ env: process.env })
}).required();

const init = async function (options) {

    const { config, basedir = Path.dirname(config), onconfig, protocols, environment } = await Joi.validate(options, schema);

    const resolved = await Config.resolve({ basedir, config, protocols, environment });

    const store = await (onconfig ? onconfig(resolved) : Promise.resolve(resolved));

    const steerage = {
        name: Pkg.name,

        version: Pkg.version,

        register: function (server) {

            const appSettings = store.get('server.app') || {};

            Object.defineProperty(server.app, 'config', {
                enumerable: false,
                configurable: false,
                writeable: false,
                value: {
                    get(key) {

                        return Props.get(appSettings, key);
                    },
                    set(key, value) {

                        Props.set(appSettings, key, value);
                    }
                }
            });
        }
    };

    const plugins = await Plugins.resolve(store.get('register'));

    plugins.unshift(steerage);

    const server = Hapi.server(store.get('server'));

    await server.register(plugins);

    const routes = store.get('routes');
    if (routes) {
        server.route(routes);
    }

    return server;
};

module.exports = { init };
