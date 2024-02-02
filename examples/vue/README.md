# Vue Example

A basic example combining Vue, Vitest, Vue Testing Library, and Virtual Screen Reader.

There are two components with tests:

1. A button that increments a polite live region counter
2. A text area with a remaining character count live region with debounce logic

Run this example with:

```bash
cd examples/vue
yarn install --frozen-lockfile
yarn test
```

> [!IMPORTANT]
> This example serves to demonstrate how you can use the Virtual screen reader. The components themselves may not be using best accessibility practices.
>
> Always evaluate your own components for accessibility and test with real users.
