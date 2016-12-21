# steerage

[Hapi](http://hapijs.com) (version `>= 15.0.0 < 17.0.0`) composition plugin leveraging [Confidence](https://github.com/hapijs/confidence).

Supports [Shortstop](https://github.com/krakenjs/shortstop) handlers for superpowers.

### API

`steerage` exports a function to configure a Hapi server.

### Configuration options

- `config` - a fully resolved path to a configuration document (relative paths in this document are from the document's location).
- `basedir` - optional alternative location to base `shortstop` relative paths from.
- `hooks` - an optional object containing hook functions consisting of:
    - `config(manifest, callback)` - hook for modifying config prior to compose.
    - `connection(name, config, callback)` - hook for modifying the server connection config before added.
    - `register(name, config, callback)` - hook for modifying the plugin config before register.
- `protocols` - optional additional custom protocols for `shortstop`.
- `environment` - optional additional criteria for `confidence` property resolution and defaults to `{ env: process.env }`.

### Manifest

The resulting configuration (please see [Confidence](https://github.com/hapijs/confidence)) should contain the (minimum) following:

- `server` - optional [server settings](https://hapijs.com/api#serversettings) overrides.
- `connections` - object defining [server connections](http://hapijs.com/api#serverconnectionoptions), with key name being a default label.
- `register` - an object defining [plugins](http://hapijs.com/api#plugins), with optional additional properties:
    - `enabled` - can be set to `false` to disable registering this plugin (defaults to `true`).
    - `select` - passed to `register`.
    - `before` - a string or array of strings of plugin names (keys in the `plugins` object) used to reorder.
    - `after` - a string or array of strings of plugin names used to reorder.

Example:

```json
{
    "server": {
        "debug": {
            "log": {
                "$filter": "env.NODE_ENV",
                "$default": ["debug"],
                "production": ["warn"]
            }
        }
    },
    "connections": {
        "api": {
            "port": "env:API_PORT"
        },
        "web": {
            "port": "env:WEB_PORT",
            "labels": ["web"]
        }
    },
    "register": {
        "good": {
            "register": "require:good",
            "options": {
                "reporters": {
                    "console": [{
                        "module": "good-console"
                    }, "stdout"]
                }
            },
            "select": ["api", "web"]
        }
    }
}
```

In addition, the [Confidence](https://github.com/hapijs/confidence) configuration store will be accessible on `server.app.config`.

### Usage

```javascript
import Path from 'path';
import Steerage from 'steerage';
import Hapi from 'hapi';

const server = new Hapi.Server();

server.register({
    register: Steerage,
    options: {
        config: Path.join(__dirname, 'fixtures', 'config', 'config.json')
    }
}, (error) => {
    if (error) {
        console.error(error.stack);
        return;
    }

    //Do other stuffs with server object.

    //Also, config values available via server.app.config, for example:
    server.app.config.get('/server');

    server.start(() => {
        for (let connection of server.connections) {
            console.log(`${connection.settings.labels} server running at ${connection.info.uri}`)
        }
    });
});
```
