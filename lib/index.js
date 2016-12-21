'use strict';

const Pkg = require('../package.json');
const Compose = require('./compose');
const Async = require('./async');
const Resolver = require('./resolver');
const Promisify = require('./promisify');
const Path = require('path');
const Shush = require('shush');
const Hoek = require('hoek');
const Joi = require('joi');

const schema = Joi.object({
    basedir: Joi.string().allow(null),
    config: Joi.string().required(),
    hooks: Joi.object({
        config: Joi.func().allow(null),
        connection: Joi.func().allow(null),
        register: Joi.func().allow(null)
    }).default(),
    protocols: Joi.object().default(),
    environment: Joi.object().default({ env: process.env })
}).required();

const register = function (server, options, next) {
    const validation = Joi.validate(options, schema);

    Hoek.assert(!validation.error, validation.error);

    const settings = validation.value;

    configure(server, settings).then(next).catch(next);
};


const configure = Async(
    function *(server, { basedir, config, hooks, protocols, environment }) {
        basedir = basedir || Path.dirname(config);

        const resolve = Resolver({ basedir, protocols });
        const configobject = Shush(config);
        const store = yield resolve(configobject, Promisify(hooks.config));

        yield Compose(server, { store, environment, hooks });
    }
);

register.attributes = { name: Pkg.name, version: Pkg.version };

module.exports = register;
