type ColorPickerProps = { onPick: (color: string) => void };

export function ColorPicker({ onPick }: ColorPickerProps) {
  const colors = ["red", "green", "blue"];
  return (
    <div>
      {colors.map((c) => (
        <button key={c} onClick={() => onPick(c.toUpperCase())}>{c}</button>
      ))}
    </div>
  );
}