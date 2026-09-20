import { login } from './login';
import { expect, test } from './test';
import { createContent } from './content';

/**
 * Acceptance coverage for the training add-on's registry ("Plone") Highlight
 * block:
 *
 *   - it renders its title and body,
 *   - the `backgroundColor` style field injects `--highlight-bg`,
 *   - the `blockWidth` style field constrains the block, and the block content
 *     fills that width in the public view (regression guard for the inner
 *     element shrinking to its text instead of filling the container).
 *
 * Content/background are asserted through classic `blocks`/`blocks_layout`
 * (migrated to a Somersault value on read). Width is asserted through a
 * pre-built Somersault value — the shape the editor actually persists — because
 * the classic->somersault migration resets `blockWidth` to the schema default.
 */

const AMBER_RGB = 'rgb(254, 243, 199)';
const HIGHLIGHT_BLOCK_ID = 'a1b2c3d4-1111-2222-3333-highlightblock';

// Container widths defined by the theme (see theming/styles/theme.css).
const CONTAINER_WIDTH: Record<string, number> = {
  narrow: 620,
  default: 940,
  layout: 1440,
};

const somersaultDoc = (
  nodes: Array<Record<string, unknown>>,
): ((body: Record<string, unknown>) => Record<string, unknown>) => {
  return (body) => {
    body.blocks = {
      __somersault__: {
        '@type': '__somersault__',
        value: [
          { type: 'title', children: [{ text: 'Highlight' }] },
          ...nodes,
        ],
      },
    };
    body.blocks_layout = { items: ['__somersault__'] };
    return body;
  };
};

const highlightNode = (data: Record<string, unknown>) => ({
  '@type': 'highlight',
  type: 'ploneBlock',
  children: [{ text: '' }],
  ...data,
});

test.describe('Highlight block (registry)', () => {
  test('renders title, body and the selected background color', async ({
    page,
  }) => {
    await login(page);

    const contentId = `highlight-registry-${Date.now()}`;
    await createContent(page, {
      contentType: 'Document',
      contentId,
      contentTitle: 'Highlight Registry Document',
      transition: 'publish',
      bodyModifier: (body) => {
        const blocks = body.blocks as Record<string, unknown>;
        const layout = body.blocks_layout as { items: string[] };
        blocks[HIGHLIGHT_BLOCK_ID] = {
          '@type': 'highlight',
          title: 'Heads up',
          body: 'This is the highlighted body text.',
          backgroundColor: 'amber',
        };
        layout.items = [...layout.items, HIGHLIGHT_BLOCK_ID];
        return body;
      },
    });

    await page.goto(`/${contentId}`, { waitUntil: 'networkidle' });

    const block = page.locator('.block-highlight');
    await expect(block).toBeVisible();
    await expect(block.getByText('Heads up')).toBeVisible();
    await expect(
      block.getByText('This is the highlighted body text.'),
    ).toBeVisible();

    // `backgroundColor` style field -> `--highlight-bg` -> computed background.
    await expect(block.locator('.highlight-inner')).toHaveCSS(
      'background-color',
      AMBER_RGB,
    );
  });

  test('with no background selected, no highlight background is applied', async ({
    page,
  }) => {
    await login(page);

    const contentId = `highlight-none-${Date.now()}`;
    await createContent(page, {
      contentType: 'Document',
      contentId,
      contentTitle: 'Highlight None Document',
      transition: 'publish',
      bodyModifier: (body) => {
        const blocks = body.blocks as Record<string, unknown>;
        const layout = body.blocks_layout as { items: string[] };
        blocks[HIGHLIGHT_BLOCK_ID] = {
          '@type': 'highlight',
          title: 'No background',
          body: 'Plain highlight.',
          backgroundColor: 'none',
        };
        layout.items = [...layout.items, HIGHLIGHT_BLOCK_ID];
        return body;
      },
    });

    await page.goto(`/${contentId}`, { waitUntil: 'networkidle' });

    const inner = page.locator('.block-highlight .highlight-inner');
    await expect(inner).toBeVisible();
    await expect(inner).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });

  // The block content must fill the width the `blockWidth` style field sets,
  // for every width, in the public view.
  for (const width of ['narrow', 'default', 'layout'] as const) {
    test(`block content fills the container at "${width}" width`, async ({
      page,
    }) => {
      await login(page);

      const contentId = `highlight-width-${width}-${Date.now()}`;
      await createContent(page, {
        contentType: 'Document',
        contentId,
        contentTitle: `Highlight ${width}`,
        transition: 'publish',
        bodyModifier: somersaultDoc([
          highlightNode({ title: `Width ${width}`, body: 'Body', blockWidth: width }),
        ]),
      });

      await page.goto(`/${contentId}`, { waitUntil: 'networkidle' });

      const block = page.locator('.block-highlight');
      await expect(block).toBeVisible();

      const sizes = await block.evaluate((el) => {
        const container = el.querySelector(
          '.block-inner-container',
        ) as HTMLElement;
        const inner = el.querySelector('.highlight-inner') as HTMLElement;
        return {
          container: Math.round(container.getBoundingClientRect().width),
          inner: Math.round(inner.getBoundingClientRect().width),
        };
      });

      // The container is constrained to the expected width…
      expect(Math.abs(sizes.container - CONTAINER_WIDTH[width])).toBeLessThanOrEqual(2);
      // …and the block content fills it (does not shrink to its text).
      expect(sizes.inner).toBe(sizes.container);
    });
  }
});
