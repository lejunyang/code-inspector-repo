# code-inspector-plugin Vue scoped CSS Reproduction

This project is a minimal reproduction for `code-inspector-plugin@1.6.1` with `rsbuild@1.7.5`, `@rsbuild/plugin-vue@1.1.2`, and `vue@3.5.33`.

## Reproduce

```bash
pnpm install --no-frozen-lockfile
pnpm build
pnpm inspect
```

## Actual Result

`src/App.vue` contains:

- `<style scoped lang="less">`
- `padding-right: v-bind(headerPaddingRight)`
- a large static template block that Vue compiles into `createStaticVNode`
- `codeInspectorPlugin({ dev: true, server: 'close', bundler: 'rspack' })`

After build, the static vnode and the CSS use different Vue scoped ids:

```text
dist/static/js/async/*.js:
<section class="static-card" data-v-20677e94>...

dist/static/css/async/*.css:
.static-card[data-v-53e4d722] { ... }
.static-card .col-header[data-v-53e4d722]:first-child { ... }

dist/static/js/async/*.js:
__scopeId: "data-v-53e4d722"
```

This breaks Vue scoped CSS for the static block because DOM nodes have `data-v-20677e94`, while CSS selectors expect `data-v-53e4d722`.

`pnpm inspect` also shows that the built output contains only a small number of `data-insp-path` attributes, even though transforming `src/App.vue` directly through `@code-inspector/core.transformCode` injects more attributes.

## Why This Looks Like a Plugin Issue

Vue's SFC compilation expects template, style, and runtime `__scopeId` to share the same id. In this setup, enabling `codeInspectorPlugin` makes the static vnode, CSS selectors, and component `__scopeId` disagree in a production build.

The same build also preserves only 2 `data-insp-path` attributes in `dist`, while a direct `@code-inspector/core.transformCode` call on `src/App.vue` injects 11 attributes. This indicates that the Vue template transform is not consistently reflected in the final Rspack/Vue production output.

## Expected Result

The static vnode, CSS selectors, and component `__scopeId` should all use the same `data-v-*` value, and Vue template nodes should consistently preserve `data-insp-path` in the production build.
