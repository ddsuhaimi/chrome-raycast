# Chrome Raycast

A Raycast-inspired command palette Chrome extension for quick tab switching and browser actions.

## Features

- 🚀 **Quick Tab Switching** - Instantly search and switch between open tabs
- ⚡ **Command Palette** - Access browser actions with a simple keyboard shortcut
- 🔍 **Fuzzy Search** - Find tabs and commands with intelligent matching
- 🎨 **Beautiful UI** - Modern, dark-themed interface built with Tailwind CSS
- 🔒 **CSS Isolation** - Shadow DOM prevents style conflicts with host pages

## Installation

### Development

1. Clone the repository:
```bash
git clone https://github.com/ddsuhaimi/chrome-raycast.git
cd chrome-raycast
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Usage

- Press `Cmd+Shift+K` (Mac) or `Ctrl+Shift+K` (Windows/Linux) to open the command palette
- Type to search through your open tabs
- Type `>` to enter command mode and access browser actions
- Use arrow keys to navigate results
- Press `Enter` to select or `Escape` to close

## Built With

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Fuse.js](https://fusejs.io/) - Fuzzy search
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT

## Author

[Dedi Suhaimi](https://github.com/ddsuhaimi)

