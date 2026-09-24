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
      ? "bg-danger-bg text-danger"
      : stock <= 3
        ? "bg-warning-bg text-warning"
        : "bg-forest-soft text-forest";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
}
