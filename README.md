# hapi-configure

[Hapi](http://hapijs.com) composition tool leveraging [Confidence](https://github.com/hapijs/confidence).

Supports [Shortstop](https://github.com/krakenjs/shortstop) handlers for superpowers.

### API

`hapi-configure` exports a function to configure a Hapi server.

It takes the following arguments:

- `options`
    - `config` - a fully resolved path to a configuration document (relative paths in this document are from the document's location).
    - `protocols` - optional additional custom protocols for `shortstop`.
    - `environment` - optional additional criteria for `confidence` property resolution.
- `callback(error, server)` - an optional callback - omitting returns a promise.

In addition, `hapi-configure` exports the `compose` function for bypassing `confidence` and `shortstop` to compose directly.

### Manifest

The resulting configuration (please see [Confidence](https://github.com/hapijs/confidence)) should contain the (minimum) following:

- `server` - optional [server options](http://hapijs.com/api#new-serveroptions).
- `connections` - object defining [server connections](http://hapijs.com/api#serverconnectionoptions), with key name being a default label.
- `plugins` - an object defining [plugins](http://hapijs.com/api#plugins), with optional additional properties:
    - `select` - passed to `register`.
    - `before` - a string or array of strings of plugin names (keys in the `plugins` object) used to reorder.
    - `after` - a string or array of strings of plugin names used to reorder.
- `routes` - an object defining [routes](http://hapijs.com/tutorials/routing), with in addition to standard properties:
    - `select` - optional array of connection labels.
    - `before` - a string or array of strings of plugin names (keys in the `plugins` object) used to reorder.
    - `after` - a string or array of strings of plugin names used to reorder.

In addition to `handler` property in `routes`, `handler` can be an object defining how to create the handler, with:

- `module` - the module (or file), which in absence of a factory method is expected to be a factory that returns a handler.
- `method` - the factory method, if anything other than the top level export.
- `arguments` - an array of arguments to apply to the factory.

In the case of all route factories, the context (`this`) will contain both the `server` and `target` (if a `select` is used).
A `function` should always be used rather than a arrow function for the factory so that this context can be bound.

Example:

```json
{
    "server": {
        "debug": {
            "log": {
                "$filter": "env",
                "$default": ["debug"],
                "production": ["warn"]
            }
        }
    },
    "connections": {
        "api": {
            "port": 9000
        },
        "web": {
            "port": 8000,
            "labels": ["web"]
        }
    },
    "plugins": {
        "good": {
            "register": "require:good",
            "options": {
                "reporters": [{
                    "reporter": "require:good-console",
                    "events": {
                        "log": {
                            "$filter": "env",
                            "$default": ["error", "medium", "info", "debug"],
                            "production": ["error", "medium"]
                        }
                    }
                }]
            },
            "select": ["api", "web"]
        }
    },
    "routes": {
        "testRoute": {
            "path": "/test",
            "method": "GET",
            "handler": {
                "module": "require:../handlers",
                "method": "createTestHandler",
                "arguments": [
                    "testArgument"
                ]
            },
            "select": ["web"]
        }
    }
}
```

In addition, the [Confidence](https://github.com/hapijs/confidence) configuration store will be accessible on `server.app.config`.

### Usage

```javascript
import Path from 'path';
import HapiConfigure from 'hapi-configure';

//Note: will return a promise if no callback.
HapiConfigure({ config: Path.join(__dirname, 'config', 'config.json')}, (error, server) => {
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

### CLI

You can also run from the command line, assuming you have a configuration that doesn't rely on performing post-config steps.

```shell
hapi-configure ./config/config.json
```
