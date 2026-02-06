# Sticky Pro

[![Figma Widget](https://img.shields.io/badge/Figma-Widget-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/widget-docs/)

A powerful and versatile Figma widget for creating interactive sticky notes with multiple content types like rich text editing, code blocks, and task management capabilities.

![Sticky Pro Cover](assets/Sticky%20pro%20cover.jpg)

## ✨ Features

### Content Types
- **✍🏻 Text Blocks** - Rich text editing with multiple formatting options (H1, B1, C1)
- **💻 Code Blocks** - Syntax-highlighted code snippets for technical documentation
- **✅ Todo Blocks** - Interactive checklists with checkboxes for task management

### Text Formatting
- **Heading (H1)** - Large, bold text for titles and headers
- **Body (B1)** - Standard body text formatting
- **Caption (C1)** - Smaller text for captions and notes
- **List Support** - Bullet points, numbered lists, or plain text

### Customization
- **Dark & Light Themes** - Switch between themes via the property menu
- **Resizable Width** - Toggle between narrow (360px) and wide (480px) layouts
- **Customizable Heading** - Add a main heading to organize your sticky notes

### User Experience
- **Inline Editing** - Click any block to edit directly
- **Focus Management** - Smart focus handling for seamless editing
- **Property Menu Integration** - Native Figma property menu for quick actions
- **Add Block Menu** - Easy block creation with visual menu
- **Multi-line Support** - Add multiple lines within text blocks

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/en/download/)
- **Figma Desktop App** - Required for widget development
- **Antigravity by Google** (recommended) - [Open here](https://antigravity.google/)

### Installation

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the widget**:
   ```bash
   npm run build
   ```

4. **Open in Figma**:
   - Open Figma Desktop App
   - Go to `Plugins` → `Development` → `Import plugin from manifest...`
   - Select the `manifest.json` file from this directory

## 🛠️ Development

### Development Workflow

1. **Start watch mode** (auto-rebuilds on save):
   ```bash
   npm run watch
   ```

   Or in Antigravity by Google:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Run Build Task"
   - Select "npm: watch"

2. **Make changes** to your code in `code.tsx` or component files

3. **Reload the widget** in Figma:
   - Right-click the widget → `Reload`
   - Or use `Plugins` → `Development` → `Reload current plugin`

### Build Scripts

| Command | Description |
|--------|-------------|
| `npm run build` | Build with source maps (development) |
| `npm run build:prod` | Build minified (production) |
| `npm run watch` | Watch mode for development (auto-rebuild) |
| `npm run tsc` | Type check without building |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint errors automatically |

### TypeScript

Built with TypeScript and esbuild for fast, type-safe development.

## 📁 Project Structure

- `code.tsx` - widget entry point
- `components/` - UI blocks and menus
- `hooks/` - state and focus helpers
- `utils/` and `constants/` - shared logic and config
- `manifest.json` and `dist/` - widget config and build output

## 🎯 Quick Usage

1. Insert the widget in Figma.
2. Add `Text`, `Todo`, or `Code` blocks.
3. Use the property menu to format text, switch theme, and resize.

## 🐛 Troubleshooting

- Run `npm run build` and confirm `dist/code.js` exists.
- Use `npm run watch` during development.
- Reload from `Plugins` -> `Development` -> `Reload current plugin`.

## 📄 License

MIT License © Asif Ali

## 🔗 Resources

- [Figma Widget Documentation](https://www.figma.com/widget-docs/)
- [Figma Widget Setup Guide](https://www.figma.com/widget-docs/setup-guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
