# Installation and development

## CEP development mode

CEP extensions may be blocked by default because this starter is not Adobe-signed. For local development, follow Adobe's official CEP documentation for your operating system and CEP version to enable debug mode. Avoid running registry/terminal commands from untrusted sources. Restart the Adobe application after changing CEP settings.

## Install locally

1. Close Premiere Pro and After Effects.
2. Copy the contents of `extension/` into a folder named `RahilFX` in the per-user CEP extensions directory:
   - Windows: `%APPDATA%\\Adobe\\CEP\\extensions\\RahilFX`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/RahilFX`
3. Confirm `CSXS/manifest.xml` is directly inside the `RahilFX` folder.
4. Open Premiere Pro or After Effects and look under **Window > Extensions (Legacy)** (the label varies by Adobe version).
5. Open **RahilFX**. If it is absent, verify CEP debug mode and that the application build supports CEP/legacy panels.

## Validate

Run `npm test` and `npm run validate` from the repository root. Those checks do not replace testing inside both Adobe applications. Test any edit on a duplicate project first.

## Compatibility

This project uses CEP/ExtendScript, not UXP. Adobe host support and scripting APIs vary across application releases; compatibility is not guaranteed merely because an app can load CEP panels. Publish an explicit tested-version matrix only after testing real application builds on Windows and macOS.
