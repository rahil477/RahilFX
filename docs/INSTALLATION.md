# Installation and development

## CEP development mode

CEP extensions may be blocked by default because this starter is not Adobe-signed. For local development, enable CEP debug mode using Adobe's official CEP documentation for your operating system and CEP version. Do not run downloaded registry/terminal commands from untrusted sources. Restart the Adobe application after changing CEP settings.

## Install this extension locally

1. Close Premiere Pro and After Effects.
2. Copy the `extension` directory to the per-user CEP extensions directory and rename the copied directory to `RahilFX`:
   - Windows: `%APPDATA%\\Adobe\\CEP\\extensions\\RahilFX`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/RahilFX`
3. The copied directory should contain `CSXS/manifest.xml` directly at its root.
4. Start Premiere Pro or After Effects and look under **Window > Extensions (Legacy)** (the label varies by Adobe version).
5. Open **RahilFX**. If it does not appear, verify CEP debug mode and the application's support for CEP/legacy panels.

## Validate

Run `npm test` and `npm run validate` from the repository root. Those checks do not replace testing inside both Adobe applications. Test any edit on a duplicate project first.

## Compatibility

This project uses CEP/ExtendScript, not the newer UXP framework. Adobe host support and scripting APIs vary across application releases; compatibility is not guaranteed merely because an app can load CEP panels. The feature bridge reports unsupported operations where possible. Publish an explicit tested-version matrix only after testing real application builds on Windows and macOS.
