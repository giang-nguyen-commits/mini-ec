"use client";

export function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-zinc-300">
      <button
        type="button"
        aria-label="数量を減らす"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="h-9 w-9 text-lg leading-none disabled:text-zinc-300"
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        aria-label="数量を増やす"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 text-lg leading-none disabled:text-zinc-300"
      >
        +
      </button>
    </div>
  );
}
