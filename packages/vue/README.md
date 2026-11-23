# Government of Ireland Design System – Vue

Build government websites and digital services with Vue using the [Government of Ireland Design System](https://ds.services.gov.ie/). This library brings together reusable UI components and shared styles to help teams create consistent interfaces across public services. Use it to give your application a familiar look and feel, with less time spent building common interface elements from scratch.

> **Beta:** The Vue library currently includes a subset of the design system components. More components are being added.

## Installation

Requires Vue 3.5 or later.

```bash
npm install @ogcio/design-system-vue @ogcio/theme-govie
```

The package lists `vue` and `lodash` as peer dependencies.

### Styles

The stylesheet uses values from the theme. Import the theme, component styles and fonts once, in your application’s entry file (for example `main.ts`), before any application styles:

```ts
import '@ogcio/theme-govie/theme.css';
import '@ogcio/design-system-vue/styles.css';
import '@ogcio/design-system-vue/fonts.css';
```

If your application already loads Lato, you can leave out `fonts.css`.

The package includes a compiled stylesheet, so you do not need to configure Tailwind in your application. The stylesheet includes Tailwind Preflight, which resets default browser styles across the whole application, including elements outside the design system.

## Usage

Import components by name and use them in your templates. For example, import `Container`, `H1` and `Paragraph`:

```vue
<script setup lang="ts">
import { Container, H1, Paragraph } from '@ogcio/design-system-vue';
</script>

<template>
  <Container>
    <H1>Apply for a passport</H1>
    <Paragraph>Check what you need before you start.</Paragraph>
  </Container>
</template>
```

The main entry point carries the full component set: layout primitives, typography, actions, and the Header, Footer and SideNav families.

Components work like any other Vue component. Pass content through the default slot, listen for events with `v-on` (for example `@click` on `Button`), and add your own `class` and `style`, which are merged with the component’s styles.

### Icons

Icons ship from the `/icons` subpath and are used like any other component. For example, import `SearchIcon` and use `<SearchIcon />`:

```ts
import { SearchIcon } from '@ogcio/design-system-vue/icons';
```

Each icon accepts props including `size`, `color` and `label`. `size` sets the width and height in pixels, for example `:size="32"` or `size="32"`, and defaults to 24. Set `label` to give the icon an accessible name; without a label, it is hidden from assistive technology. The full set of icons is catalogued on the [icons page](https://ds.services.gov.ie/resources/icons/).

### Logos

The Government of Ireland logos ship from the `/logos` subpath. For example, import `LogoGoldGreen` and use `<LogoGoldGreen />`:

```ts
import { LogoGoldGreen } from '@ogcio/design-system-vue/logos';
```

Each logo accepts props including `size` and `label`. `size` sets the width in pixels and the height scales to match. Without it, each logo renders at its original width. Set `label` to give the logo an accessible name; without a label, it is hidden from assistive technology. The logos are shown on the [logos page](https://ds.services.gov.ie/resources/logos/).

## Documentation

See the [design system documentation](https://ds.services.gov.ie/components/) for component guidance and accessibility notes. For Vue examples and component props, [run Storybook locally](#storybook). Some components shown in Storybook are not yet exported by the package. Check the package’s type declarations for available exports and props.

## Local development

This package is part of the `govie-ds` monorepo. Use Node.js 24 or later and the pnpm version specified in the root `package.json`. Install the dependencies and build it from the repository root:

```bash
pnpm install
pnpm --filter '@ogcio/design-system-vue^...' build
pnpm --filter @ogcio/design-system-vue build
```

The first build command builds the library’s dependencies; the second builds the Vue library.

### Storybook

From the repository root, run:

```bash
pnpm storybook:vue
```

This builds the dependencies and starts Storybook on port 6006.

### Scripts

Run from `packages/vue`:

| Script                 | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `pnpm build`           | Build the library and stylesheet into `dist`.            |
| `pnpm build:styles`    | Rebuild the stylesheet.                                  |
| `pnpm typecheck`       | Type-check the sources.                                  |
| `pnpm test`            | Run every story’s interaction test in headless Chromium. |
| `pnpm test:watch`      | Run the tests in watch mode.                             |
| `pnpm storybook:dev`   | Run Storybook on port 6006.                              |
| `pnpm storybook:build` | Build Storybook into `storybook-static`.                 |
| `pnpm lint`            | Lint the package.                                        |
| `pnpm format`          | Format the package with Prettier.                        |
| `pnpm format:check`    | Check formatting without changing files.                 |

The tests run in a real browser through Playwright. If Chromium is not installed, run `pnpm exec playwright install chromium` first.

### Build output

The build uses Vite in library mode to bundle the `index`, `icons` and `logos` entry points as ES modules, then `vue-tsc` to emit type declarations, then compiles the Tailwind stylesheet. All outputs go into `dist`. `vue`, `lodash` and `tailwind-variants` are left external.

The package is published from its own directory, so npm includes `README.md`, `LICENSE` and `package.json` alongside the paths listed in the `files` field of `package.json`.

### Generated sources

The Angular, React and Vue libraries share component sources in `@ogcio/design-system-core`. Mitosis generates the files in `src/atoms` from `packages/core/atoms`. Regenerating them overwrites local changes, so edit the shared source first, then regenerate the Vue components:

```bash
pnpm --filter @ogcio/design-system-core build:vue
```

The components in `src` outside `src/atoms` are hand-written wrappers that give the generated atoms a Vue-style API (slots, emitted events, and `class` and `style` passed through). You can edit them, the Vue stories in `src/stories`, the package configuration and this README directly. See [`packages/core/README.md`](https://github.com/ogcio/govie-ds/blob/main/packages/core/README.md) for guidance on writing Mitosis components, including patterns that work in one framework but fail in another.

### Tailwind safelist

Tailwind cannot detect class names assembled at runtime. Components such as `Grid`, `Stack` and `HeaderNavItem` use this pattern, so their generated class names are covered by the `safelist` in `tailwind.config.ts`. If you add a component that builds class names this way, update the safelist too. Otherwise, those styles will be missing from the compiled stylesheet.

## Licence

[MIT](https://github.com/ogcio/govie-ds/blob/main/packages/vue/LICENSE) © OGCIO (PER).
