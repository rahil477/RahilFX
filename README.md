# RahilFX

An original, extensible Adobe CEP panel foundation for Premiere Pro and After Effects. The repository is being built incrementally; it is not yet a complete editing suite.

> RahilFX is an independent project. It does not include or reproduce another product's code, branding, templates, LUTs, or audio assets. Planned features are not claims of current functionality.

## Implemented in 0.1.1

- One CEP panel declaration for Premiere Pro and After Effects.
- Host bridge with guarded project/sequence/composition information.
- After Effects: set selected layer stretch, add a text layer, add a composition-sized solid, and fade selected layers in. Operations are grouped in AE Undo.
- Manual transcript segmentation and SRT download. This does **not** perform speech recognition, translation, or timeline insertion.
- English/Azerbaijani UI strings, theme preference, and a feature-status roadmap.
- Node.js tests and repository validation.

Premiere clip speed editing, automatic captions, scene/beat/silence analysis, speed ramps, templates, SFX and LUT tools remain planned or under investigation. The feature table in [docs/FEATURES.md](docs/FEATURES.md) is the authoritative status list.

## Requirements and development

- Adobe Premiere Pro or After Effects that supports CEP/legacy extensions. Host APIs vary by release and require in-app testing.
- Node.js 18+ to run validation and tests; the CEP panel itself uses vanilla JavaScript.

```sh
npm test
npm run validate
```

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for local install instructions and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the module design. Test edits on duplicate projects and use the application's Undo if needed. No media or project data is uploaded by this source.

## License

MIT for original source code in this repository. No third-party libraries or media assets are bundled.
