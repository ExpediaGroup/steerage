'use strict';

const Test = require('tape');
const Steerage = require('../lib');
const Path = require('path');

Test('configures', async function (t) {
    t.plan(7);

    try {
        const server = await Steerage.init({ config: Path.join(__dirname, 'fixtures', 'config', 'config.json') });

        t.equal(server.settings.debug.log[0], 'debug', 'override of server settings.');

        const registrations = Object.keys(server.registrations);

        t.equal(registrations.length, 3, 'registered two plugins.');

        t.equal(registrations[1], 'otherPlugin', 're-ordered plugins.');

        t.equal(server.settings.app.name, 'testApp', 'server.settings.app available.');

        t.equal(server.settings.app.nameCopy, 'testApp', 'server.settings.app.nameCopy from config protocol.');

        t.equal(server.app.config.get('name'), 'testApp', 'server.app.config get.');

        server.app.config.set('hello.world', 'hello world!');

        t.equal(server.app.config.get('hello.world'), 'hello world!', 'server.app.config set.');
    }
    catch (error) {
        console.log(error.stack);
    }

});

Test('environment', async function (t) {
    t.plan(2);

    try {
        const server = await Steerage.init({
            config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
            environment: {
                env: {
                    NODE_ENV: 'production'
                }
            }
        });

        t.equal(server.settings.debug.log[0], 'warn', 'server settings overriden by environment.');
        t.ok(server.registrations.prodPlugin, 'plugins present on connection.');
    }
    catch (error) {
        console.log(error.stack);
    }
});

Test('onconfig', async function (t) {
    try {
        let called = 0;

        const server = await Steerage.init({
            config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
            onconfig: async function (config) {
                called++;
                return config;
            }
        });

        t.ok(called, 'onconfig hook called.');
        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
});

Test('disable plugin', async function (t) {
    try {
        const server = await Steerage.init({
            config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
            onconfig: function (config) {
                config.set('register.devPlugin.enabled', false);
                return config;
            }
        });

        t.ok(!server.registrations.devPlugin, 'did not register disabled plugin.');

        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
});

Test('error in registrations', async function (t) {
    t.plan(1);

    try {
        const server = await Steerage.init({
            config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
            onconfig: function (config) {
                config.set('register.devPlugin', {});
            }
        });
    }
    catch (error) {
        t.pass('received error.');
    }
});

Test('error in hook', async function (t) {
    t.plan(1);

    try {
        const server = await Steerage.init({
            config: Path.join(__dirname, 'fixtures', 'config', 'config.json'),
            onconfig: function (config) {
                throw new Error('blamo!');
            }
        });
    }
    catch (error) {
        t.pass('received error.');
    }
});

Test('adds route', async function (t) {
    try {
        const server = await Steerage.init({
            config: Path.join(__dirname, 'fixtures', 'config', 'config.json')
        });

        const response = await server.inject({
            method: 'GET',
            url: '/admin'
        })

        t.ok(response.payload === 'OK', 'added route');

        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
});
