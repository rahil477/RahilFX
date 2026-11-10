# RahilFX

An original, extensible Adobe CEP panel foundation for Premiere Pro and After Effects. The repository is being built incrementally; it is not yet a complete editing suite.

> RahilFX is an independent project. It does not include or reproduce another product's code, branding, templates, LUTs, or audio assets. Planned features are not claims of current functionality.

## Current progress (0.1.2)

Implemented:
- Shared CEP panel declaration for Premiere Pro and After Effects.
- Host detection and guarded project/sequence/composition information.
- Premiere clip speed action with a safe guard for selected clips in active sequence.
- After Effects layer stretch, text layer creation, solid creation, and fade-in helpers.
- Manual transcript segmentation and SRT download. This does not perform ASR/translation or insert captions into the timeline.
- English/Azerbaijani UI strings, theme preference, and feature-status roadmap.
- Node.js tests and validation.

Planned or under research:
- Speed-ramp curves and custom presets
- Scene detection and marker creation
- Silence/filler-word removal
- Auto transcription and translation
- Motion graphics/template library
- Audio SFX and LUT packs

See [docs/FEATURES.md](docs/FEATURES.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Requirements and development

- Adobe Premiere Pro or After Effects with CEP/legacy extension support. Host APIs vary by release; test with duplicate projects.
- Node.js 18+ to run validation and tests.

```sh
npm test
npm run validate
```

## License

MIT for original source code in this repository. No third-party libraries or media assets are bundled.
