import { DEMO_BANNER } from "@/lib/brand";

export function SiteDemoNotice() {
  return (
    <p className="border-b border-border bg-forest-soft px-4 py-2 text-center text-[11px] leading-5 tracking-wide text-forest-strong sm:text-xs">
      {DEMO_BANNER}
    </p>
  );
}
