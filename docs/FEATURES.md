# Feature inventory

Status key: **Implemented** = present in this starter; **Planned** = design target, not yet implemented; **Research** = requires host/API or media-processing validation before promising support.

| Area | Capability | Status / notes |
|---|---|---|
| Shared panel | CEP panel, host detection, navigation, English/Azerbaijani strings, theme, local preferences | Implemented foundation |
| Shared | Project/sequence/composition metadata | Basic guarded metadata implemented |
| Premiere | Apply speed to selected timeline clips | Basic guarded operation; validate against target Premiere versions |
| After Effects | Apply speed to selected layers via stretch | Basic operation; validate on a copied project |
| Subtitles | Segment manually supplied transcript and download SRT | Implemented; no speech recognition/translation yet |
| Subtitles | Automatic transcription, language detection, translation, caption styling and timeline insertion | Research / planned; ASR provider, privacy, and native caption API to be decided |
| Editing | Speed-ramp curve presets and custom curve editor | Planned |
| Editing | Scene detection/cuts/markers, beat detection and beat-aligned montage | Research / planned; needs media analysis and precise host editing APIs |
| Editing | Silence/filler-word detection and removal | Research / planned; needs audio analysis and safe timeline ripple logic |
| Editing | Reframe/duplicate, transform, text/solid/image insertion, clipboard workflow | Planned |
| Effects/audio | Effect browser/favorites, flash, shake, audio cleanup, audio presets, SFX | Planned; original/licensed assets only |
| Motion graphics | Titles, logo/social templates, callouts, badges, transitions and animations | Planned; original templates/assets only |
| Color | LUT browser/intensity and social safe-zone overlays | Planned |
| Product | Preset management, update flow, backups/rollback, installer, AI assistant | Planned; backup and update features require security design |

A feature should only be marked implemented after it has a host-specific implementation and repeatable validation on supported application versions. Unsupported host actions should return a clear message rather than silently changing the project.
