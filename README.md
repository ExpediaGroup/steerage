# steerage

Plugin for configuring and composing [Hapi](http://hapijs.com) servers through a configuration file or manifest.

Supports environment-aware configuration and more using [determination](https://github.com/tlivings/determination).

### Usage

**Please note:**
* steerage version 8.x now requires hapi v18 - if you are still on hapi v17, please continue to use steerage version 7.x instead.
* Versions >=7 are now available as `@vrbo/steerage`. Releases are no longer published as `steerage`.

```javascript
const Path = require('path');
const Steerage = require('@vrbo/steerage');

Steerage.init({ config: Path.join(__dirname, 'config', 'config.json') }).then((server) => {
    server.start();
});
```

### API

- `init(options)` - a promise that returns a configured hapi server.

### Configuration options

- `config` - a fully resolved path to a configuration document (relative paths in this document are from the document's location).
- `basedir` - optional alternative location to base [shortstop](https://github.com/krakenjs/shortstop) relative paths from.
- `onconfig(store)` - hook for modifying config prior to creating list of plugins to register — may be async function or promise.
- `protocols` - optional additional custom [shortstop](https://github.com/krakenjs/shortstop) protocols.
- `environment` - optional additional criteria for [confidence](https://github.com/hapijs/confidence) property resolution and defaults to `{ env: process.env }`.

### Example onconfig hook

`onconfig` might be used to merge one configuration into another.

```javascript
const Path = require('path');
const Steerage = require('@vrbo/steerage');
const Determination = require('determination');

const overrideResolve = Determination.create({ config: Path.join(__dirname, 'config', 'overrides.json') });

const onconfig = async function (configStore) {
    const overrides = await overrideResolve.resolve();

    configStore.use(overrides);

    return configStore;
};

Steerage.init({ config: Path.join(__dirname, 'config', 'config.json'), onconfig }).then((server) => {
    server.start();
});
```

### Default supported configuration protocols

- `file` - read a file.
- `path` - resolve a path.
- `base64` - resolve a base64 string.
- `env` - access an environment variable.
- `require` - require a javascript or json file.
- `exec` - execute a function.
- `glob` - match files using the patterns shell uses.
- `config` - access another property in the config.
- `import` - imports another JSON file, supports comments.

See [determination](https://github.com/tlivings/determination).

### Manifest

The resulting configuration (please see [determination](https://github.com/tlivings/determination)) should contain the (minimum) following:

- `server` - optional [server settings](https://hapijs.com/api#serversettings) overrides.
- `register` - an object defining [plugins](http://hapijs.com/api#plugins), with optional additional properties:
    - `plugin` - Hapi plugin object.
    - `enabled` - can be set to `false` to disable registering this plugin (defaults to `true`).
    - `before` - a string or array of strings of plugin names (keys in the `plugins` object) used to reorder.
    - `after` - a string or array of strings of plugin names used to reorder.
- `routes` - an array of Hapi route configuration objects.

Example:

```json
{
    "server": {
        "app": {
            "name": "testApp"
        },
        "debug": {
            "log": {
                "$filter": "env.NODE_ENV",
                "$default": ["debug"],
                "production": ["warn"]
            }
        }
    },
    "register": {
        "good": {
            "plugin": "require:good",
            "options": {
                "reporters": {
                    "console": [{
                        "module": "good-console"
                    }, "stdout"]
                }
            }
        }
    },
    "routes": [
        {
            "path": "/admin",
            "method": "GET",
            "handler": "require:../admin",
            "options": {
                "auth": {
                    "$filter": "env.NODE_ENV",
                    "$default": false,
                    "production": "required"
                }
            }
        }
    ]
}
```

In addition, the configuration will be accessible as `server.app.config`. This config object allows access to deep properties:

```
server.app.config.get('my.app.property');
server.app.config.set('my.app.property', true);
```

The resolved (for the `environment` at start time) JSON configuration can be viewed as `server.settings.app`.
