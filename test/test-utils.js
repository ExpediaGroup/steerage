'use strict';

const Test = require('tape');
const Proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const Utils = require('../lib/utils');
const Path = require('path');

Test('createConfigResolver', async (t) => {

    t.plan(1);

    try {
        const configPath = Path.join(__dirname,  'fixtures', 'config', 'config.json');

        const userConfig = await Utils.createConfigResolver({
            config: configPath,
            basedir: Path.dirname(configPath),
            protocols: {},
            environment: { env: process.env }
        });

        t.equal(userConfig.data.server.app.name, 'testApp', 'resolved with configured config field appName.');
        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
});

Test('safeRequire', (t) => {

    t.plan(1);

    try {
        const myModule = {};
        const MockedUtils = Proxyquire('../lib/utils', {
            './my-module': myModule
        });
        const requiredSafely = MockedUtils.safeRequire('./my-module');

        t.equal(requiredSafely, myModule, 'should return the required module.');
        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
});

Test('mergeManifestConfigs', async (t) => {

    t.plan(5);

    try {
        const resolved = await Utils.mergeManifestConfigs({
            basedir: null,
            config: [
                Path.join(__dirname,  'fixtures', 'config', 'config.json'),
                Path.join(__dirname, 'fixtures', 'external-config', 'config.json')
            ],
            environment: { env: process.env },
            protocols: {}
        });

        t.equal(resolved.get('server.app.nested.foo'), 'bar', 'contain value from provided user config file.');
        t.equal(resolved.get('server.app.name'), 'testAppExternalConfig', 'overwrite existing base config key with value from provided user config file.');

        const registrations = Object.keys(resolved.get('register'));

        t.equal(registrations.length, 3, 'merges all configured plugins.');
        t.equal(registrations[1], 'otherPlugin', 'verify base config plugin exists in resolved config.');
        t.equal(registrations[2], 'externalConfigDevPlugin', 'verify user config plugin exists in resolved config.');

        t.end();
    }
    catch (error) {
        console.log(error.stack);
    }
});
