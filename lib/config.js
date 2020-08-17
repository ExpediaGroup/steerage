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

const Handlers = require('shortstop-handlers');
const Hoek = require('@hapi/hoek');
const Determination = require('@vrbo/determination');

const resolve = async function ({ config, basedir, protocols, environment }) {

    const defaultProtocols = {
        file: Handlers.file(basedir),
        path: Handlers.path(basedir),
        base64: Handlers.base64(),
        env: Handlers.env(),
        require: Handlers.require(basedir),
        exec: Handlers.exec(basedir),
        glob: Handlers.glob(basedir)
    };

    protocols = Hoek.applyToDefaults(defaultProtocols, protocols);

    const resolver = Determination.create({
        config,
        protocols,
        criteria: environment
    });

    return await resolver.resolve();
};

module.exports = { resolve };
