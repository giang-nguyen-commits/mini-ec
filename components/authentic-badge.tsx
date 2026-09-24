export function AuthenticBadge({ authentic }: { authentic: boolean }) {
  const tone = authentic
    ? "bg-forest-soft text-forest"
    : "bg-surface-muted text-foreground-muted";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {authentic ? "正規品（デモ掲載）" : "参考データ"}
    </span>
  );
}
