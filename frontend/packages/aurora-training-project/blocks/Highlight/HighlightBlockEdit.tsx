import type { BlockEditProps } from '@plone/types';

// Content (title + body) is edited inline on the canvas; the styling controls
// (block width + background color) live in the settings form generated from
// `HighlightSchema`. This separation is the teaching point: *content* is
// authored in place, *settings* live in the sidebar.
const HighlightBlockEdit = (props: BlockEditProps) => {
  const { data, setBlock } = props;
  const title = (data.title as string) || '';
  const body = (data.body as string) || '';

  return (
    <div className="highlight-inner highlight-inner--edit">
      <input
        className="highlight-title highlight-title--edit"
        value={title}
        placeholder="Highlight title…"
        onChange={(event) => setBlock({ ...data, title: event.target.value })}
      />
      <textarea
        className="highlight-body highlight-body--edit"
        value={body}
        rows={3}
        placeholder="Write the highlighted text…"
        onChange={(event) => setBlock({ ...data, body: event.target.value })}
      />
    </div>
  );
};

export default HighlightBlockEdit;
