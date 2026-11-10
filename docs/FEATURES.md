# Feature inventory

Status key: **Implemented** = source exists in this starter; **Planned** = design target, not implemented; **Research** = host API/media-processing behavior must be validated before promising support.

| Area | Capability | Status / notes |
|---|---|---|
| Shared panel | CEP panel, host detection, navigation, English/Azerbaijani strings, theme, local preferences | Implemented foundation |
| Shared | Project/sequence/composition metadata | Basic guarded metadata implemented |
| Premiere | Apply speed to selected timeline clips | Research; no supported public implementation yet |
| After Effects | Set selected layer stretch | Basic host implementation, grouped in Undo; test in supported AE versions |
| After Effects | Add text layer and composition-sized solid | Implemented; grouped in Undo |
| After Effects | Fade selected layers in | Implemented with opacity keyframes and Undo group |
| Subtitles | Segment manually supplied transcript and download SRT | Implemented; no speech recognition, translation, timing alignment, or timeline insertion |
| Subtitles | Automatic transcription, language detection, translation, caption styling and insertion | Research / planned; ASR provider, privacy, and native caption API to be decided |
| Editing | Speed-ramp curve presets and custom curve editor | Planned |
| Editing | Scene detection/cuts/markers, beat detection and beat-aligned montage | Research / planned; needs media analysis and precise host editing APIs |
| Editing | Silence/filler-word detection and removal | Research / planned; needs audio analysis and safe timeline ripple logic |
| Editing | Reframe/duplicate, transform, text/solid/image insertion, clipboard workflow | Planned (AE text/solid operations above are implemented) |
| Effects/audio | Effect browser/favorites, flash, shake, audio cleanup, audio presets, SFX | Planned; original/licensed assets only |
| Motion graphics | Titles, logo/social templates, callouts, badges, transitions and animations | Planned; original templates/assets only |
| Color | LUT browser/intensity and social safe-zone overlays | Planned |
| Product | Preset management, update flow, backups/rollback, installer, AI assistant | Planned; backup and update features require security design |

Only mark features implemented after host-specific code exists and repeatable validation passes in the advertised Adobe versions. Unsupported operations should return a clear message without silently changing a project.
