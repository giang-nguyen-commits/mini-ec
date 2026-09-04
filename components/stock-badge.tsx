function getStockLabel(stock: number) {
  if (stock === 0) {
    return "売り切れ";
  }
  if (stock <= 3) {
    return "残りわずか";
  }
  return "在庫あり";
}

export function StockBadge({ stock }: { stock: number }) {
  const label = getStockLabel(stock);
  const tone =
    stock === 0
      ? "bg-red-50 text-red-700"
      : stock <= 3
        ? "bg-amber-50 text-amber-800"
        : "bg-emerald-50 text-forest";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
}
