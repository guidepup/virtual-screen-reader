# Web Test Runner Example

A basic example combining [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) and Virtual Screen Reader.

This includes a test asserting on basic navigation of a page, and the necessary packages and config to allow Virtual Screen Reader to operate in an ESM only context.

Run this example with:

```bash
cd examples/web-test-runner
yarn install --frozen-lockfile
yarn test
```

> [!IMPORTANT]
> This example serves to demonstrate how you can use the Virtual Screen Reader. The components themselves may not be using best accessibility practices.
>
> Always evaluate your own components for accessibility and test with real users.
