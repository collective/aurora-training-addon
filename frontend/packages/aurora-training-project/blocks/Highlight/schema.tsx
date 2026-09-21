import type { JSONSchema } from '@plone/types';
import { HIGHLIGHT_COLORS, DEFAULT_HIGHLIGHT_COLOR } from './palette';

// The block settings form is generated from this schema. The title and body
// are edited inline on the canvas (see `HighlightBlockEdit`), so the settings
// form only exposes the two *styling* controls we want to teach:
//
// - `blockWidth`    -> the shared width style field (narrow/default/layout/full)
// - `backgroundColor` -> our own style field, backed by `HIGHLIGHT_COLORS`
//
// Both are marked `styleField: true`, which is what lets `StyleFieldsPlugin`
// resolve their stored id to a CSS custom property on the rendered block.
export function HighlightSchema(): JSONSchema {
  return {
    title: 'Highlight',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['blockWidth', 'backgroundColor'],
      },
    ],
    properties: {
      blockWidth: {
        title: 'Block width',
        widget: 'width',
        default: 'default',
        styleField: true,
      },
      backgroundColor: {
        title: 'Background color',
        widget: 'highlightColor',
        default: DEFAULT_HIGHLIGHT_COLOR,
        styleField: true,
        // `choices` doubles as the list of allowed ids for the style field
        // runtime and as the options for the swatch widget.
        choices: HIGHLIGHT_COLORS.map((color) => [color.name, color.label]),
      },
    },
    required: [],
  };
}
