import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import ModalExample from '../OpenModal.vue'

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from '../../../../lib/cjs/index.min.js'

describe('Open Modal', () => {
  afterEach(async () => {
    await virtual.stop()
  })

  it('announces the modal as a dialog', async () => {
    render(ModalExample)

    await virtual.start({ container: document.body })

    // Navigate to the button and interact to open Modal
    await virtual.next()
    await virtual.act()

    // Navigate through the modal
    await virtual.next()
    await virtual.next()
    await virtual.next()

    expect(await virtual.spokenPhraseLog()).toMatchInlineSnapshot(`
      [
        "document",
        "button, Open Modal",
        "dialog, Modal Title, modal",
        "button, Close Modal",
        "heading, Modal Title, level 1",
        "Example Modal Content",
        "end of dialog, Modal Title, modal",
      ]
    `)
  })
})
