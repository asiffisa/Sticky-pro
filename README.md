# Sticky Pro

A powerful and versatile Figma widget for creating interactive sticky notes with multiple content types like rich text editing, code blocks, and task management capabilities.

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
- **Visual Studio Code** (recommended) - [Download here](https://code.visualstudio.com/)

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

   Or in VS Code:
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

This widget uses **TypeScript** for type safety and better developer experience. TypeScript adds type annotations that help catch bugs early and provide better IDE support.

- **Valid JavaScript is valid TypeScript** - Easy to learn
- **Type definitions included** - Full Figma API support
- **Compiled with esbuild** - Fast builds

For more information, visit [TypeScript Documentation](https://www.typescriptlang.org/)

## 📁 Project Structure

```
Sticky-pro/
├── code.tsx                 # Main widget entry point
├── types.ts                 # TypeScript type definitions
├── manifest.json            # Widget metadata and configuration
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript configuration
│
├── components/              # React-like components
│   ├── MainHeading.tsx      # Main heading input component
│   ├── BlockComponent.tsx   # Block router component
│   ├── TextBlock.tsx        # Text block component
│   ├── TodoBlock.tsx        # Todo block component
│   ├── TodoItem.tsx         # Individual todo item
│   ├── AddBlockMenu.tsx     # Block creation menu
│   └── CloseButton.tsx      # Close button component
│
├── hooks/                   # Custom hooks for state management
│   ├── useBlockOperations.ts    # Block manipulation functions
│   └── useFocusManagement.ts    # Focus state management
│
├── utils/                   # Utility functions
│   ├── helpers.ts           # General helper functions
│   ├── propertyMenu.ts     # Property menu configuration
│   └── textFormat.ts       # Text formatting utilities
│
├── constants/               # Centralized constants
│   ├── theme.ts            # Color themes (dark/light)
│   ├── layout.ts           # Dimensions, spacing, typography
│   └── icons.ts            # SVG icons and icon helpers
│
└── dist/                    # Compiled output (generated)
    ├── code.js             # Bundled widget code
    └── code.js.map         # Source map for debugging
```

## 🎯 Usage Guide

### Creating Blocks

1. **Add a new block**:
   - Click the "Add new block" button at the bottom
   - Select block type: Text, Todo, or Code

2. **Edit blocks**:
   - Click any block to focus and edit
   - Use the property menu (right-click or widget menu) for formatting options

### Text Blocks

- **Add lines**: Press Enter while editing
- **Format text**: Use property menu to change format (H1, B1, C1)
- **Lists**: Convert to bullet or numbered lists via property menu
- **Delete lines**: Use property menu when a line is focused

### Todo Blocks

- **Add items**: Click "Add todo" or use property menu
- **Toggle completion**: Click the checkbox
- **Edit items**: Click the text to edit inline
- **Delete items**: Use property menu when item is focused

### Customization

- **Change theme**: Use property menu → Theme → Dark/Light
- **Resize widget**: Use property menu → Width → Narrow/Wide
- **Set heading**: Click the top heading area to edit

## 🏗️ Architecture

### Component Architecture

The widget follows a modular architecture with clear separation of concerns:

- **Components** - UI components for rendering
- **Hooks** - Reusable state management logic
- **Utils** - Pure functions and helpers
- **Constants** - Centralized configuration

### State Management

- Uses Figma's `useSyncedState` for persistent state
- Focus management handled through custom hooks
- Block operations centralized in `useBlockOperations` hook

### Key Design Patterns

- **Component Composition** - Small, focused components
- **Custom Hooks** - Reusable stateful logic
- **Utility Functions** - Pure, testable functions
- **Type Safety** - Full TypeScript coverage

## 📚 Widget API Reference

This widget uses the **Figma Widget API v1.0.0**. Key APIs used:

- `widget.useSyncedState` - Persistent state management
- `widget.usePropertyMenu` - Native property menu integration
- `widget.AutoLayout` - Layout components
- `widget.Input`, `widget.Text`, `widget.SVG` - UI components

For complete API documentation, visit [Figma Widget Documentation](https://www.figma.com/widget-docs/)

## 🐛 Troubleshooting

### Widget not loading
- Ensure `dist/code.js` exists (run `npm run build`)
- Check browser console for errors
- Verify `manifest.json` points to correct file

### Changes not appearing
- Reload the widget in Figma
- Check that watch mode is running
- Verify build completed successfully

### Type errors
- Run `npm run tsc` to check types
- Ensure all dependencies are installed (`npm install`)

## 📝 Code Quality

This project includes:

- **ESLint** - Code linting with Figma plugin rules
- **TypeScript** - Type checking and safety
- **JSDoc** - Comprehensive documentation
- **Modular Architecture** - Well-organized codebase

## 🤝 Contributing

This is a Figma widget template. To customize:

1. Modify `code.tsx` for main functionality
2. Add components in `components/` directory
3. Add utilities in `utils/` directory
4. Update constants in `constants/` directory

## 📄 License

[Add your license here]

## 🔗 Resources

- [Figma Widget Documentation](https://www.figma.com/widget-docs/)
- [Figma Widget Setup Guide](https://www.figma.com/widget-docs/setup-guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)

---

**Made with ❤️ for Figma by Asif**
