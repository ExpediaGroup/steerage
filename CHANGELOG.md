### 8.2.0

- Added a `reset()` method that can be used to reset the entire `server.app.config` object
- Formalized the `get()` behavior where calling `get()` with no key returns the entire config object

### 8.1.1

- Updated license and copyright
- Updated dependencies (#15)

### 8.1.0

- Added `routes` configuration #14

### 8.0.0

- Update to support hapi v18 and to use @hapi scoped packages
- BREAKING: @hapi/hapi version >= 18.3.1 now required (also note the new "@hapi/" npm scope)

### 7.0.3

- Update dependencies including allowing for peer dependency Hapi 18.

### 7.0.2

- Adjusted fixtures and server creation for Hapi 17.

### 7.0.1

- Documentation update.

### 7.0.0

- Update to support hapi@17.x and node 8.x.
- BREAKING: Usage has changed. See README.
- BREAKING: Support for connections removed.
- BREAKING: `connection` hook removed (see above).
- BREAKING: Support for select on plugins removed.
- BREAKING: Under manifest's `register` section, each object's `register` attribute is renamed `plugin`.
- BREAKING: `hooks` replaced with single `onconfig` function.

### 6.0.1

- Bump to `determination@2.0.0` to get protocol handler context binding.

### 6.0.0

- Use `determination` for configuration resolution.
- [BREAKING] `onconfig` passes a `determination` config store instead of raw JSON.

### v5.0.1

- `config` protocol support added.

### v5.0.0

- [BREAKING] `server.settings.app` is now the runtime config, not a `confidence` store.
- [BREAKING] `server.app.config` is now an accessor to `server.settings.app` with `get`, `set`.

### v4.0.0

- [BREAKING] Converted to a plugin.

### v3.0.3

- Default criteria for `confidence` is `{ env: process.env }`.

### v3.0.2

- Updated hapi support to include 15 and 16.

### v3.0.1

- Fixed disabling a plugin from being registered via hook.

### v3.0.0

- Added lifecycle hooks `config`, `connection`, `register`.
- [BREAKING] Changed `plugins` to `register`.
- [BREAKING] Removed `routes` composition (use `plugins` when configuration is needed instead).
- [BREAKING] Removed `onconfig` in favor of `hooks`.

### v2.0.0

- Does not validate schema any longer.
- Does not expose `compose`.
- Introduces `onconfig` hook function for modifying manifest before compose.

### V1.0.0

- Previous incarnation was `hapi-configure`.
