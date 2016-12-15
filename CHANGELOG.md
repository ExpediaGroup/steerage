
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
