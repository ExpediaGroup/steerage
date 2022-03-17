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

const { catalystTracer } = require('./utils');

catalystTracer();

const Pkg = require('../package.json');
const Plugins = require('./plugins');
const Joi = require('joi');
const Props = require('dot-prop');
const Hapi = require('@hapi/hapi');
const Utils = require('./utils');

const schema = Joi.object({
    basedir: Joi.string().allow(null),
    config: Joi.array().items(Joi.string()).single().required(),
    environment: Joi.object().default({ env: process.env }),
    onconfig: Joi.function().allow(null),
    protocols: Joi.object().default(),
    defaults: Joi.alternatives(Joi.string(), Joi.object()).default({}),
    overrides: Joi.alternatives(Joi.string(), Joi.object()).default({})
}).required();

const init = async function (options) {

    const { onconfig, ...mergeOptions } = await schema.validateAsync(options);

    const resolved = await Utils.mergeManifestConfigs(mergeOptions);

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

    server.validator(require('joi'));
    
    await server.register(plugins);

    const routes = store.get('routes');
    if (routes) {
        server.route(routes);
    }

    return server;
};

module.exports = { init };
