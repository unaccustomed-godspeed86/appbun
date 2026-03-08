# Web App Repo Prompt

Copy the prompt below into your coding agent when you want it to turn the web app you are currently building into a desktop app.

```text
You are working inside the repository of an existing web app.

Create a desktop app wrapper for this app using `appbun`.

Inputs you must fill in before running:
- Web app URL to package: [WEB_APP_URL]
- App name: [APP_NAME]
- Desktop wrapper output directory inside this repo: ./desktop/[APP_SLUG]
- Window size: [WIDTH]x[HEIGHT]
- Theme color: [THEME_COLOR]

Rules:
- Treat the current repository as the source web app project.
- Use `appbun@latest`; do not hand-roll the wrapper unless appbun output needs a specific fix.
- Put the generated desktop wrapper inside this repo so the team can version it together.
- If the URL points to a local dev server, make sure the dev server is running and reachable before packaging.
- Keep the generated project inspectable and editable.
- Preserve site branding and icon metadata when available.
- If the output directory already exists, prefer a safe non-destructive path or explicit confirmation.
- On macOS, include the DMG packaging step.

Execution plan:
1. If needed, start the current web app and verify [WEB_APP_URL] loads.
2. Run:
   npx -y appbun@latest [WEB_APP_URL] --name "[APP_NAME]" --out-dir ./desktop/[APP_SLUG] --width [WIDTH] --height [HEIGHT] --theme-color [THEME_COLOR] --yes
3. Change into the generated wrapper directory:
   cd ./desktop/[APP_SLUG]
4. Install dependencies:
   bun install
5. Build the desktop wrapper:
   bun run build
6. On macOS, also build the DMG:
   bun run build:dmg
7. If useful, add a short README note explaining how to rebuild the desktop wrapper.

When you reply, include:
- what command you ran
- where the generated project was written
- what metadata or icons were detected
- what still needs manual attention, if anything
```
