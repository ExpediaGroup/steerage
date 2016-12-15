'use strict';

const Test = require('tape');
const Steerage = require('../lib');
const Async = require('../lib/async');
const Path = require('path');

Test('test steerage', (t) => {

    t.test('configures', Async(function *(t) {
        t.plan(6);

        try {
            const server = yield Steerage({
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json')
            });

            t.ok(server, 'server not null.');
            t.ok(server.settings.debug.log, 'override server properties.');
            t.equal(server.connections.length, 2, 'set connections.');
            t.ok(server.select('web').registrations.testPlugin, 'plugins present on connection.');

            const plugins = Object.keys(server.select('web').registrations);

            t.equal(plugins[0], 'testPlugin2', 're-ordered plugins.');

            t.ok(server.app.config.get('/server'), 'server.app.config accessible.');
        }
        catch (error) {
            console.log(error.stack);
        }
    }));

    t.test('hooks', Async(function *(t) {
        try {
            yield Steerage({
                config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
                hooks: {
                    connection(config, callback) {
                        t.pass('called connection hook');
                        callback(null, config);
                    },
                    config(config, callback) {
                        t.pass('called config hook');
                        callback(null, config);
                    },
                    register(name, options, callback) {
                        t.pass('called register hook');
                        callback(null, options);
                    }
                }
            });

            t.end();
        }
        catch (error) {
            console.log(error.stack);
        }
    }));

});
