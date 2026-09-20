import type { BlockViewProps } from '@plone/types';

// The view stays deliberately tiny: it renders the block's content and
// nothing else. The outer `.block.block-highlight` wrapper and the
// `--highlight-bg` / `--block-width` custom properties are added by the
// framework (block anatomy + style fields), so the block does not manage its
// own layout or width. See the "Block anatomy" doc in the Aurora core.
type HighlightViewProps = BlockViewProps & {
  isEditMode?: boolean;
};

const HighlightBlockView = (props: HighlightViewProps) => {
  const { data } = props;
  const title = (data.title as string) || '';
  const body = (data.body as string) || '';

  return (
    <div className="highlight-inner">
      {title ? <h3 className="highlight-title">{title}</h3> : null}
      {body ? <p className="highlight-body">{body}</p> : null}
    </div>
  );
};

export default HighlightBlockView;
