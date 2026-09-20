import type { ConfigType } from '@plone/registry';
import type { BlockConfigBase } from '@plone/types';
import HighlightBlockInfo from '../blocks/Highlight';
import HighlightColorWidget from '../blocks/Highlight/HighlightColorWidget';
import { HIGHLIGHT_COLORS } from '../blocks/Highlight/palette';

export default function install(config: ConfigType) {
  // 1. Register the block itself.
  config.blocks.blocksConfig.highlight =
    HighlightBlockInfo as unknown as BlockConfigBase;

  // 2. Register the settings-form widget used by the `backgroundColor` field.
  config.registerWidget({
    key: 'widget',
    definition: { highlightColor: HighlightColorWidget },
  });

  // 3. Register the style-field definition for `backgroundColor`.
  //    The name MUST match the schema field name. The runtime resolves the
  //    stored id (for example `amber`) to this definition and injects its
  //    `style` object onto the block element as a CSS custom property.
  //    (`blockWidth` has an equivalent definition registered by Aurora core.)
  config.registerUtility({
    type: 'styleFieldDefinition',
    name: 'backgroundColor',
    method: () =>
      HIGHLIGHT_COLORS.map((color) => ({
        name: color.name,
        label: color.label,
        style: color.name === 'none' ? {} : { '--highlight-bg': color.value },
      })),
  });

  return config;
}
