'use strict';

const { GetTracerConfig } = require('hapi-datadog-intrumentation/lib');
const Path = require('path');
const Config = require('./config');

const Utils = {
    catalystTracer() {
        GetTracerConfig(Path.join(__dirname, 'init-config.jsonc'));
    },
    async createConfigResolver(options) {
        // Some file watchers only watch a file if it's been require'd.
        // Determination doesn't call "require()" on the file internally,
        // so by "require"-ing here, we allow for file watching.
        // Parsing is expected to fail since manifests allow for comments.
        Utils.safeRequire(options.config);

        // Create and return the resolver
        return await Config.resolve(options);
    },

    safeRequire(name) { // eslint-disable-line consistent-return

        try {
            return require(name);
        }
        catch (e) {
            // noop
        }
    },

    async mergeManifestConfigs(options) {

        const {
            basedir,
            config,
            environment,
            protocols,
            defaults,
            overrides
        } = options;

        let resolved;

        for (const configPath of config) {

            const resolvedConfig = await Utils.createConfigResolver({
                config: configPath,
                basedir: basedir || Path.dirname(configPath),
                protocols,
                environment,
                defaults,
                overrides
            });

            if (!resolved) {
                resolved = resolvedConfig;
            }
            else {
                resolved.merge(resolvedConfig.data);
            }
        }

        return resolved;
    }
};

module.exports = Utils;
