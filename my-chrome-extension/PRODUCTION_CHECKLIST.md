# Canvas Extension Production Checklist

## Release Safety

- Keep auth/network calls in background only.
- Keep UI layers (popup/content) message-driven.
- Update shared constants in one place: utils/constants.js.
- Update backend/frontend URLs in one place: utils/config.js and manifest.json host/externally_connectable lists.
- Keep card payload shape aligned with backend schema.

## Pre-Release Manual Tests

- Login from popup and content panel.
- Save URL from popup.
- Save selected text via context menu.
- Save link/image via context menu.
- Quick-save current tab via keyboard shortcut.
- Capture screenshot into selected canvas.
- Sign out and verify sign-in prompt appears.
- Reload browser and verify persisted auth/session behavior.

## Permission Hygiene

- Use minimum required permissions only.
- Keep host_permissions limited to required origins.
- Keep externally_connectable limited to trusted frontend domains.

## Versioning

- Bump version in manifest.json each release.
- Document user-visible changes in release notes.
- Retest extension-login handshake after extension ID changes.

## Maintainable File Boundaries

- background.js: auth/session/cache, API orchestration, extension events.
- content/sticky-saver.js: in-page UI + message bridge.
- popup/popup.js: compact UI + message bridge.
- utils/api.js: fetch transport and endpoint wrappers.
- utils/cardFactory.js: card payload creation rules.
- utils/config.js: origins/base URLs.
- utils/constants.js: message/storage contracts.
