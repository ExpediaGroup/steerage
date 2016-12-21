
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
