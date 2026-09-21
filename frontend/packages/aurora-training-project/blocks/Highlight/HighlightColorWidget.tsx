import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorSwatch,
  parseColor,
  type Color,
} from 'react-aria-components';
import { HIGHLIGHT_COLORS, DEFAULT_HIGHLIGHT_COLOR } from './palette';

// A custom block-settings widget built on React Aria Components'
// `ColorSwatchPicker`. RAC works in terms of *color values*, but our style
// field stores a *semantic id* (for example `amber`). This widget bridges the
// two: it renders one swatch per palette entry and translates the selected
// color back to its id before handing it to the form.
type HighlightColorWidgetProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
};

// Normalized-color -> id, so we can map RAC's `onChange` (a Color) back to the
// semantic id we persist.
const idByColor = new Map(
  HIGHLIGHT_COLORS.map((color) => [
    parseColor(color.value).toString('hexa'),
    color.name,
  ]),
);

const colorById = new Map(
  HIGHLIGHT_COLORS.map((color) => [color.name, color.value]),
);

export function HighlightColorWidget(props: HighlightColorWidgetProps) {
  const { value = DEFAULT_HIGHLIGHT_COLOR, onChange } = props;
  const selectedColor = colorById.get(value) ?? colorById.get('none')!;

  const handleChange = (color: Color) => {
    const id = idByColor.get(color.toString('hexa'));
    if (id) onChange?.(id);
  };

  return (
    <ColorSwatchPicker
      className="highlight-color-widget"
      value={selectedColor}
      onChange={handleChange}
    >
      {HIGHLIGHT_COLORS.map((color) => (
        <ColorSwatchPickerItem
          key={color.name}
          color={color.value}
          className="highlight-color-swatch"
        >
          <ColorSwatch aria-label={color.label} />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  );
}

export default HighlightColorWidget;
