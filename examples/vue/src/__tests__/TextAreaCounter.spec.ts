import { afterEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import TextareaCounter from '../TextAreaCounter.vue'

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from '../../../../lib/cjs/index.min.js'

describe('Text Area Counter', () => {
  afterEach(async () => {
    await virtual.stop()
  })

  it('announces the remaining character count after 1 second if there are more than 10 allowed characters remaining', async () => {
    const { container } = render(TextareaCounter)

    await virtual.start({ container })
    await virtual.next()

    // Type 9 characters
    await virtual.type('123456789')
    await waitFor(() => screen.getByDisplayValue('123456789'))
    await waitFor(() =>
      screen.getByText('41 characters left', { selector: '[data-testid="remaining-count"]' })
    )

    // Has not yet announced the character count
    expect(await virtual.spokenPhraseLog()).toMatchInlineSnapshot(`
      [
        "heading, Text Area Counter, level 1",
        "textbox",
      ]
    `)

    // Wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Ensure that the screen reader experience is as expected
    expect(await virtual.spokenPhraseLog()).toMatchInlineSnapshot(`
      [
        "heading, Text Area Counter, level 1",
        "textbox",
        "polite: 41 characters left",
      ]
    `)
  })

  it('announces the remaining character count for every character when in the last 10 remaining characters', async () => {
    const { container } = render(TextareaCounter)

    await virtual.start({ container })
    await virtual.next()

    // Type 50 characters
    await virtual.type('12345678901234567890123456789012345678901234567890')
    await waitFor(() =>
      screen.getByDisplayValue('12345678901234567890123456789012345678901234567890')
    )
    await waitFor(() =>
      screen.getByText('0 characters left', { selector: '[data-testid="remaining-count"]' })
    )

    // Ensure that the screen reader experience is as expected
    expect(await virtual.spokenPhraseLog()).toMatchInlineSnapshot(`
      [
        "heading, Text Area Counter, level 1",
        "textbox",
        "polite: 10 characters left",
        "polite: 9 characters left",
        "polite: 8 characters left",
        "polite: 7 characters left",
        "polite: 6 characters left",
        "polite: 5 characters left",
        "polite: 4 characters left",
        "polite: 3 characters left",
        "polite: 2 characters left",
        "polite: 1 characters left",
        "polite: 0 characters left",
      ]
    `)
  })
})
