/**
 *
 * MIT License
 *
 * Copyright (c) 2019 Expedia, Inc
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
**/

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
    onconfig: Joi.function().allow(null),
    protocols: Joi.object().default(),
    environment: Joi.object().default({ env: process.env })
}).required();

const init = async function (options) {

    const { config, basedir = Path.dirname(config), onconfig, protocols, environment } = await schema.validateAsync(options);

    const resolved = await Config.resolve({ basedir, config, protocols, environment });

    const store = await (onconfig ? onconfig(resolved) : Promise.resolve(resolved));

    const steerage = {
        name: Pkg.name,

        version: Pkg.version,

        register: function (server) {

            let appSettings = store.get('server.app') || {};

            Object.defineProperty(server.app, 'config', {
                enumerable: false,
                configurable: false,
                writeable: false,
                value: {
                    get(key) {

                        if (!key) {
                            return appSettings;
                        }

                        return Props.get(appSettings, key);
                    },
                    set(key, value) {

                        Props.set(appSettings, key, value);
                    },
                    reset(config) {

                        appSettings = config;
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
