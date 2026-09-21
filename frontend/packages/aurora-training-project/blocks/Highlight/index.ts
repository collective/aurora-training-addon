import React from 'react';
import type { BlockConfigBase } from '@plone/types';
import { HighlightIcon } from '@plone/components/Icons';
import { HighlightSchema } from './schema';

// Registry-backed ("Plone") block config. This is the classic block model:
// a `view`, an `edit`, and a `blockSchema` that drives the settings form.
// Compare with the Plate-native `highlight` element to see the two worlds.
const HighlightBlockInfo = {
  id: 'highlight',
  title: 'Highlight',
  view: React.lazy(() => import('./HighlightBlockView')),
  edit: React.lazy(() => import('./HighlightBlockEdit')),
  category: 'common',
  blockSchema: HighlightSchema,
  icon: HighlightIcon,
  defaultBlockWidth: 'default',
} satisfies Partial<BlockConfigBase>;

export default HighlightBlockInfo;
