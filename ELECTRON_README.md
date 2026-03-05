# Astro SSR + Electron

This project combines Astro with Server-Side Rendering (SSR) and Electron to create a desktop application.

## Getting Started

### Development Mode

Run the app in development mode with hot reloading:

```bash
npm run electron:dev
```

This will:
1. Start the Astro dev server on port 4321
2. Wait for the server to be ready
3. Launch the Electron app pointing to the dev server

### Production Build

Build the Astro app and run it in Electron:

```bash
npm run electron:start
```

### Create Distributable

Build the app for distribution:

```bash
npm run electron:build
```

This will create platform-specific installers in the `release/` directory:
- **macOS**: `.dmg` and `.zip` files
- **Windows**: `.exe` installer and portable version
- **Linux**: `.AppImage` and `.deb` packages

## Project Structure

```
├── electron/
│   ├── main.js      # Electron main process
│   └── preload.js   # Preload script for security
├── src/
│   └── pages/       # Astro pages
├── dist/            # Built Astro app (generated)
└── release/         # Electron distributables (generated)
```

## How It Works

1. **Development**: The Electron app connects to the Astro dev server running on localhost:4321
2. **Production**: The Electron app starts a Node.js server running the built Astro SSR app and loads it in a BrowserWindow

## Configuration

- Electron configuration is in `package.json` under the `build` key
- Astro configuration is in `astro.config.mjs`
- The main Electron process is in `electron/main.js`

## Notes

- The app uses SSR mode with the Node.js adapter
- Port 4321 is used for the Astro server (configurable in `electron/main.js`)
- The Electron app automatically starts and stops the Astro server
