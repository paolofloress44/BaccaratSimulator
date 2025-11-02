# Building Baccarat Simulator Desktop App

## Quick Start

### 1. Test the Electron App in Development

```bash
npm run electron:dev
```

This will:
- Start the Vite dev server
- Wait for it to be ready
- Launch the Electron window
- Enable hot-reload for development

### 2. Build Executables for Distribution

```bash
npm run electron:build
```

This will:
- Build the optimized production React app
- Package it with Electron
- Create installers for your platform

**Output location**: `release/` folder

### Build for Specific Platforms

#### Windows
```bash
npm run electron:build -- --win
```
Creates: `Baccarat-Simulator-Setup-1.0.0.exe`

#### macOS
```bash
npm run electron:build -- --mac
```
Creates: `Baccarat-Simulator-1.0.0.dmg`

#### Linux
```bash
npm run electron:build -- --linux
```
Creates: `Baccarat-Simulator-1.0.0.AppImage`

### Build for All Platforms (requires additional setup)

```bash
npm run electron:build -- --win --mac --linux
```

**Note**: Cross-platform building may require additional tools:
- Windows: Can build for Windows only (unless using Wine/Docker)
- macOS: Can build for Mac and Linux
- Linux: Can build for Linux and Windows (with Wine)

## Troubleshooting

### Issue: "Cannot find module 'electron'"
**Solution**: Run `npm install` first

### Issue: Build fails on Windows
**Solution**: Make sure you have:
- Node.js v16+ installed
- Administrator privileges if needed

### Issue: Large file size
**Solution**: This is normal. Electron apps include:
- Chromium browser
- Node.js runtime
- Your application code

Typical sizes:
- Windows: ~150-200 MB
- macOS: ~180-220 MB  
- Linux: ~150-180 MB

## Publishing to GitHub

### Step 1: Build the executables
```bash
npm run electron:build
```

### Step 2: Create a GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" → "Draft a new release"
3. Create a new tag: `v1.0.0`
4. Release title: "Baccarat Simulator v1.0.0"
5. Description: Copy from README features section
6. Upload files from `release/` folder:
   - `Baccarat-Simulator-Setup-1.0.0.exe` (Windows)
   - `Baccarat-Simulator-1.0.0.dmg` (macOS)
   - `Baccarat-Simulator-1.0.0.AppImage` (Linux)
7. Click "Publish release"

### Step 3: Users can now download

Users visit your repository and download from the Releases page!

## App Icons (Optional)

To add custom icons, place these files in the `build/` folder:

- **Windows**: `icon.ico` (256x256 or larger)
- **macOS**: `icon.icns` (512x512 or larger)
- **Linux**: `icon.png` (512x512 or larger)

Without custom icons, Electron will use default icons.

## Development Tips

### Testing the built app locally

After running `npm run electron:build`, you can test the built executable before publishing:

- Windows: `release/Baccarat-Simulator-Setup-1.0.0.exe`
- macOS: `release/Baccarat-Simulator-1.0.0.dmg`
- Linux: `release/Baccarat-Simulator-1.0.0.AppImage`

### Changing the app version

Update the version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

The version number will be used in the built file names.


