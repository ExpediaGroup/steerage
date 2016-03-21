'use strict';

import Test from 'tape';
import JerryTheBellybuttonElf from '../dist/lib';
import Path from 'path';

Test('test jerry-the-bellybutton-elf', t => {

    t.test('configures', async t => {
        t.plan(7);

        try {
            const server = await JerryTheBellybuttonElf();

            t.ok(server, 'server not null.');
            t.ok(server.settings.debug.log, 'override server properties.');
            t.equal(server.connections.length, 2, 'set connections.');
            t.ok(server.select('web').registrations.testPlugin, 'plugins present on connection.');

            const plugins = Object.keys(server.select('web').registrations);

            t.equal(plugins[0], 'testPlugin2', 're-ordered plugins.');

            t.ok(server.app.config.get('server'), 'server.app.config accessible.');

            const response = await server.select('web').inject({
                method: 'GET',
                url: '/test'
            });

            t.equal(response.payload, 'testArgument', 'added arguments to handler factory.');
        }
        catch (error) {
            console.log(error.stack);
        }
    });

    t.test('errors', async t => {
        t.plan(1);

        try {
            const server = await JerryTheBellybuttonElf({
                basedir: Path.join(__dirname, 'fixtures/badconfig')
            });
        }
        catch (error) {
            t.equal(error.name, 'ValidationError', 'got validation error.');
        }
    });

});
