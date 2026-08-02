# Sticky Pro

[![Figma Widget](https://img.shields.io/badge/Figma-Widget-F24E1E?logo=figma&logoColor=white)](https://developers.figma.com/docs/widgets/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Sticky Pro is a lightweight Figma and FigJam widget for structured notes, to-do lists, and code snippets.

![Sticky Pro cover](assets/Sticky%20pro%20cover.jpeg)

[Try it in Figma](https://www.figma.com/community/widget/1575988033250798795) · [Report an issue](https://github.com/asiffisa/Sticky-pro/issues)

## Built for shared work

Each content block is stored independently. This keeps collaborative edits safer: when two people edit different blocks, one update does not overwrite the other.

## Create in one place

- ✍️ Rich text with heading, body, caption, bullet, and numbered-list formatting
- ✅ Interactive to-do lists
- 💻 Code blocks for snippets and prompts
- 🎨 Dark and light themes, plus narrow and wide layouts

## Get started

```bash
npm ci
npm run build
```

In Figma Desktop, choose **Plugins → Development → Import plugin from manifest…** and select this repository’s `manifest.json`.

## Development

| Command | Purpose |
| --- | --- |
| `npm run watch` | Rebuild while you work |
| `npm run build` | Development build with source maps |
| `npm run build:prod` | Minified production build |
| `npm run tsc` | Type check |
| `npm run lint` | Check code quality |
| `npm test` | Run data-model regression tests |

Reload the widget in Figma after a build: **Plugins → Development → Reload current plugin**.

## License

MIT License © Asif Ali
