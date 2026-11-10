# Architecture

## Layers

- `extension/CSXS/manifest.xml`: CEP registration and Premiere/After Effects host declarations.
- `extension/index.html`, `styles/`, and `scripts/`: shared, dependency-free panel UI.
- `extension/host/host.jsx`: guarded ExtendScript bridge. It returns JSON strings and isolates host-specific calls.
- `extension/shared/core.js`: pure utilities usable by both the browser panel and Node tests.
- `extension/features/`: feature catalog with explicit delivery status.
- `scripts/`: repository validation; `tests/`: utility tests.

## Host bridge

The panel calls only `RFX.*` methods through `CSInterface.evalScript`. The JSX bridge detects Premiere by an active sequence and After Effects by an active composition. Every host call is guarded and responds with `{ok, data}` or `{ok:false, error}` JSON. Add new functionality behind this bridge and keep Premiere/AE-specific code separate when their object models differ.

CEP/ExtendScript APIs vary by app release. The speed operation checks for selected items and the relevant host method before applying changes; it may report that a particular version does not expose a compatible method. Never assume a successful call without testing in each supported host version.

## Privacy and safety

The current panel stores only UI preferences in local storage and does not upload media, project data, or transcripts. Do not add a cloud AI service without explicit user consent, clear disclosure, credential handling, and a documented data-retention policy. Any timeline operation should be undoable and tested on a duplicate project. Build backups/rollback as an explicit feature before claiming non-destructive behavior.

## Extension strategy

Keep shared UI and utilities host-neutral. Use adapters for Premiere and After Effects. Media analysis (speech, silence, scene changes, beats) should be an injectable service with a local/offline option where practical; outputs should be previewable before destructive timeline edits. Store original presets/assets in versioned, licensed packages rather than embedding third-party product content.
