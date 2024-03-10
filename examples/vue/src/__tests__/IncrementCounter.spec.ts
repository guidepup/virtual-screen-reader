import { afterEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import IncrementCounter from '../IncrementCounter.vue'

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from '../../../../lib/cjs/index.min.js'

describe('Increment Counter', () => {
  afterEach(async () => {
    await virtual.stop()
  })

  it('increments value on click', async () => {
    const { container } = render(IncrementCounter)

    // Start the virtual screen reader for just the Component under test
    await virtual.start({ container })

    // Move to the increment button
    await virtual.next()
    await virtual.next()

    // Click the increment button twice
    await virtual.act()
    await virtual.act()

    // Ensure that UI has updated as expected
    await waitFor(() => screen.getByText('Times clicked: 2'))

    // Move back to paragraph
    await virtual.previous()

    // Ensure that the screen reader experience is as expected
    expect(await virtual.spokenPhraseLog()).toMatchInlineSnapshot(`
      [
        "heading, Increment Counter, level 1",
        "Times clicked: 0",
        "button, increment",
        "polite: Times clicked: 1",
        "polite: Times clicked: 2",
        "Times clicked: 2",
      ]
    `)
  })
})
