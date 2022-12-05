## [12.1.3](https://github.com/expediagroup/steerage/compare/v12.1.2...v12.1.3) (2022-01-11)

### Bug Fixes

* explicitly force determination 6.0.1 ([#39](https://github.com/expediagroup/steerage/issues/39)) ([5c6268b](https://github.com/expediagroup/steerage/commit/5c6268b57f3dee72ff9e43063ed0b18a43dd8e24))

## [12.1.2](https://github.com/expediagroup/steerage/compare/v12.1.1...v12.1.2) (2022-01-05)


### Bug Fixes

* update readme to test actions ([0ee885f](https://github.com/expediagroup/steerage/commit/0ee885fe97565bc9df31c226ca5884ee3f4da90b))

## [12.1.1](https://github.com/expediagroup/steerage/compare/v12.1.0...v12.1.1) (2021-12-10)


### Bug Fixes

* readme change to test semantic release ([#34](https://github.com/expediagroup/steerage/issues/34)) ([971559b](https://github.com/expediagroup/steerage/commit/971559b167008645e32a36dd423bfb42570ea0fa))

# [12.1.0](https://github.com/expediagroup/steerage/compare/v12.0.0...v12.1.0) (2021-12-07)


### Features

* exposes overrides and defaults from determination ([#33](https://github.com/expediagroup/steerage/issues/33)) ([07b1f0b](https://github.com/expediagroup/steerage/commit/07b1f0b32d71bbcdf1ae586d764d5c3f87ad3f7a))

# [12.0.0](https://github.com/expediagroup/steerage/compare/v11.1.0...v12.0.0) (2021-11-05)


### Features

* upgrade @vrbo/determination to V6.0.0 ([#32](https://github.com/expediagroup/steerage/issues/32)) ([d944eb1](https://github.com/expediagroup/steerage/commit/d944eb1029f88e4e766d50cbb73b921583c056b8))


### BREAKING CHANGES

* This updates @vrbo/determination from the range `^4.0.0` to
`^6.0.0`. Please validate your dependencies on this can use this version and update as needed.

Co-authored-by: aaestrada <v-aaestrada@expediagroup.com>

# [11.1.0](https://github.com/expediagroup/steerage/compare/v11.0.1...v11.1.0) (2021-11-05)


### Bug Fixes

* **revert:** "upgrade @vrbo/determination to V6.0.0" ([637333e](https://github.com/expediagroup/steerage/commit/637333e430baea57da73556f1900f33c07b3d6c3))


### Features

* Revert changes from 11.0.1 ([0e785d1](https://github.com/expediagroup/steerage/commit/0e785d16fc5655b8f33ab95b1d6f357b9c1c3c6e))

### [11.1.0] Revert changes from 11.0.1
- Changes are reverted and will be republished as a BREAKING change for 12.0.0

### [11.0.1] Should have been BREAKING CHANGES

- [Fix(deps)] Drop support for `"@vrbo/determination": "4.0.0"`.
- Update `"@vrbo/determination": "4.0.0"` to `V6.0.0`.

### [11.0.0] BREAKING CHANGES

- [Breaking] Drop support for node < 12.
- Update Github test workflow to only test againt node v 14.x
- Update dependencies, npm, and engines in package.json to support node version >= 14.

# [10.0.0](https://github.com/expediagroup/steerage/compare/v9.0.1...v10.0.0) (2020-08-18)


### Features

* Update to require Hapi v20; Update dependencies; ([#28](https://github.com/expediagroup/steerage/issues/28)) ([912897c](https://github.com/expediagroup/steerage/commit/912897c938d4fa020caa0448563ed9ee415a7e67))


### BREAKING CHANGES

* The Hapi peer dependency has been changed from `>=19` to `>=20`. Please install Hapi v20 to use this version of Steerage.

## [9.0.1](https://github.com/expediagroup/steerage/compare/v9.0.0...v9.0.1) (2020-08-12)


### Bug Fixes

* **deps:** Bump dot-prop from 4.2.0 to 5.2.0 ([#26](https://github.com/expediagroup/steerage/issues/26)) ([b17ff63](https://github.com/expediagroup/steerage/commit/b17ff63e94bef4cb08399e02be92f3aa0e0b4bb0))

### 9.0.0

- [Breaking] Drop support for node < 12.
- Update Github test workflow to only test againt node v 12.x
- Update dependencies, npm, and engines in package.json to support node version >= 12.

### 8.4.0
- Add support for multiple manifest files. The `config` option now takes either a String or Array of fully resolved paths to configuration documents. If multiple paths are provided, they are merged together.

### 8.3.0
- Use `@vrbo` namespaced version of `determination`

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
