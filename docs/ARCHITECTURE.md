# Architecture

## Layers

- `extension/CSXS/manifest.xml`: CEP registration and Premiere/After Effects host declarations.
- `extension/index.html`, `styles/`, and `scripts/`: shared, dependency-free panel UI.
- `extension/host/host.jsx`: guarded ExtendScript bridge. It returns JSON strings and isolates host-specific calls.
- `extension/shared/core.js`: pure utilities usable by both the browser panel and Node tests.
- `extension/features/catalog.js`: explicit feature status inventory.
- `scripts/`: repository validation; `tests/`: utility tests.

## Host bridge

The panel calls only `RFX.*` methods through `window.__adobe_cep__.evalScript`. The JSX bridge detects Premiere by an active sequence and After Effects by an active composition. Every host call is guarded and responds with `{ok, data}` or `{ok:false, error}`. The JSON encoder is deliberately small for the simple response data used here. Keep Premiere and After Effects code separate when their object models differ.

The current speed/stretch operation is implemented only for selected After Effects layers. In Premiere, the panel returns an explicit unsupported message; it does not pretend a change was made. Do not rely on undocumented host APIs without version-specific testing.

## Privacy and safety

The panel stores only UI preferences in local storage and does not upload media, project data, or transcripts. Do not add a cloud AI service without explicit user consent, clear disclosure, credential handling, and a data-retention policy. Timeline operations should be previewable/undoable and tested on a duplicate project. Build backup/rollback before claiming non-destructive behavior.

## Extension strategy

Keep shared UI and utilities host-neutral. Use adapters for Premiere and After Effects. Media analysis (speech, silence, scene changes, beats) should be an injectable service with a local/offline option where practical; outputs should be previewable before timeline edits. Store original presets/assets in versioned, licensed packages rather than embedding third-party product content.
