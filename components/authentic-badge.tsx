export function AuthenticBadge({ authentic }: { authentic: boolean }) {
  const tone = authentic
    ? "bg-emerald-50 text-forest"
    : "bg-zinc-100 text-zinc-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {authentic ? "正規品" : "正規品未確認"}
    </span>
  );
}
