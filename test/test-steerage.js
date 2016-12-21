'use strict';

const Test = require('tape');
const Steerage = require('../lib');
const Async = require('../lib/async');
const Path = require('path');
const Hapi = require('hapi');

Test('configures', Async(function *(t) {
    t.plan(6);

    const server = new Hapi.Server();

    try {
        yield server.register({
            register: Steerage,
            options: {
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json')
            }
        });

        t.equal(server.settings.debug.log[0], 'debug', 'override of server settings.');
        t.equal(server.connections.length, 2, 'set connections.');
        t.ok(server.select('web').registrations.devPlugin, 'plugins present on connection.');

        const plugins = Object.keys(server.select('web').registrations);

        t.equal(plugins.length, 2, 'registered two plugins.');

        t.equal(plugins[0], 'otherPlugin', 're-ordered plugins.');

        t.ok(server.app.config.get('/server'), 'server.app.config accessible.');
    }
    catch (error) {
        console.log(error.stack);
    }

}));

Test('environment', Async(function *(t) {
    t.plan(2);

    const server = new Hapi.Server();

    try {
         yield server.register({
            register: Steerage,
            options: {
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
                environment: {
                    env: {
                        NODE_ENV: 'production'
                    }
                }
            }
        });

        t.equal(server.settings.debug.log[0], 'warn', 'server settings overriden by environment.');
        t.ok(server.select('web').registrations.prodPlugin, 'plugins present on connection.');
    }
    catch (error) {
        console.log(error.stack);
    }
}));


Test('hooks', Async(function *(t) {

    const server = new Hapi.Server();

    try {
         yield server.register({
            register: Steerage,
            options: {
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
                hooks: {
                    config(config, callback) {
                        t.pass('called config hook');
                        callback(null, config);
                    },
                    connection(name, config, callback) {
                        t.pass('called connection hook');
                        callback(null, config);
                    },
                    register(name, config, callback) {
                        t.pass('called register hook');
                        callback(null, config);
                    }
                }
            }
        });

        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
}));

Test('disable plugin', Async(function *(t) {

    const server = new Hapi.Server();

    try {
         yield server.register({
            register: Steerage,
            options: {
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
                hooks: {
                    register(name, config, callback) {
                        if (name === 'devPlugin') {
                            config.enabled = false;
                        }
                        callback(null, config);
                    }
                }
            }
        });

        t.ok(!server.select('web').registrations.devPlugin, 'did not register disabled plugin.');

        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
}));

Test('error in compose', Async(function *(t) {
    t.plan(1);

    const server = new Hapi.Server();

    try {
         yield server.register({
            register: Steerage,
            options: {
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
                hooks: {
                    config(config, callback) {
                        config.register.devPlugin = {};
                        callback(null, config);
                    }
                }
            }
        });
    }
    catch (error) {
        t.pass('received error.');
    }
}));

Test('error in hook', Async(function *(t) {
    t.plan(1);

    const server = new Hapi.Server();

    try {
         yield server.register({
            register: Steerage,
            options: {
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
                hooks: {
                    config(config, callback) {
                        callback(new Error('blamo'));
                    }
                }
            }
        });
    }
    catch (error) {
        t.pass('received error.');
    }
}));
