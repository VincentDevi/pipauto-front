# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start development server (runs `vinxi dev`)
- `npm run build` - Build the application for production (runs `vinxi build`)
- `npm start` - Start production server (runs `vinxi start`)

## Architecture Overview

This is a SolidStart application using TypeScript with the following key architectural components:

### Framework Stack
- **SolidJS** with SolidStart for full-stack development
- **Vinxi** as the build tool and meta-framework
- **TailwindCSS v4** for styling with custom design system
- **@kobalte/core** for accessible UI primitives

### Project Structure
- `src/app.tsx` - Root application component with router setup
- `src/routes/` - File-based routing (SolidStart convention)
- `src/components/` - Reusable components including UI components from shadcn-solid
- `src/libs/` - Utility libraries (auth configuration, utils)
- `src/entry-server.tsx` & `src/entry-client.tsx` - SSR entry points

### Styling & UI
- TailwindCSS with custom design system and CSS variables
- Kobalte for accessible component primitives
- shadcn-solid UI components in `src/components/ui/`
- Custom animations and keyframes for accordions/collapsibles

### Path Aliases
- `~/*` maps to `./src/*` (configured in tsconfig.json)
- `@/*` maps to `./src/*` (configured in app.config.ts)

