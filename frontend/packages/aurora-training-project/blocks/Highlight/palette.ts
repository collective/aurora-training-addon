// Shared background-color palette for the Highlight block.
//
// A single source of truth used in two places:
//
// - the `backgroundColor` style-field definition (see `config/blocks.ts`),
//   which turns the stored value into a `--highlight-bg` CSS custom property
// - the `HighlightColorWidget` swatch picker shown in the block settings form
//
// This is the whole point of a "style field": the block data stores a
// *semantic id* (for example `amber`), never a raw CSS color. The runtime
// resolves that id to a `StyleDefinition` and injects the custom property.
export type HighlightColor = {
  /** Semantic id stored in the block data (`data.backgroundColor`). */
  name: string;
  /** Human label shown in the settings form. */
  label: string;
  /** The CSS color injected as `--highlight-bg`. */
  value: string;
};

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  // `none` is transparent. We use an explicit transparent color (rather than
  // the keyword `transparent`) so React Aria's `parseColor` can render it as
  // a swatch; the style-field definition injects no custom property for it.
  { name: 'none', label: 'None', value: 'rgba(0, 0, 0, 0)' },
  { name: 'amber', label: 'Amber', value: '#fef3c7' },
  { name: 'sky', label: 'Sky', value: '#e0f2fe' },
  { name: 'green', label: 'Green', value: '#dcfce7' },
  { name: 'rose', label: 'Rose', value: '#ffe4e6' },
];

export const DEFAULT_HIGHLIGHT_COLOR = 'none';
