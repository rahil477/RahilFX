# RahilFX

An original, extensible Adobe CEP panel project for Premiere Pro and After Effects. This repository establishes the shared panel, host bridge, basic project inspection, selected-layer/clip speed controls where the host scripting API permits them, and a manual subtitle-to-SRT workflow.

> RahilFX is an independent project. It does not include or reproduce UmutcanFX code, branding, templates, LUTs, or audio assets. Feature names in the roadmap describe intended capabilities, not a claim that they are already implemented.

## Current status

This is the first working foundation, not a finished all-features product. Implemented now:
- Shared CEP panel for Premiere Pro and After Effects (CEP/legacy extension host).
- Host detection and guarded project/sequence/composition information.
- Selected Premiere timeline clip speed and selected After Effects layer stretch controls (host/version dependent; test on a copy of a project).
- Manual transcript segmentation and SRT download; this does not perform speech recognition or translation.
- English/Azerbaijani UI strings, theme toggle, and local settings persistence.
- Feature inventory and a Node.js test/validation command.

See [docs/FEATURES.md](docs/FEATURES.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Requirements

- Adobe Premiere Pro or After Effects with CEP/legacy extensions enabled.
- Node.js 18+ only for project validation and tests (the panel itself uses vanilla JavaScript).

## Development

```sh
npm test
npm run validate
```

The extension source is under `extension/`. CEP extensions are installed in the user-level `Adobe/CEP/extensions/RahilFX` folder; detailed instructions and compatibility caveats are in the installation guide.

## Safety

Speed changes modify the current project. Save a copy first and use the host application's Undo immediately if the result is not wanted. This starter does not promise automatic project backups or one-click rollback. No project data is uploaded or transmitted by this code.

## License

MIT for the original source code in this repository. Bundled third-party libraries/assets are intentionally not included. Adobe product names are used only to describe compatibility.
