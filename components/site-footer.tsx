import { APP_NAME, DEMO_FOOTER } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
        <p className="text-center font-[family-name:var(--font-heading)] text-lg tracking-[0.18em] text-forest-strong">
          {APP_NAME}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[11px] leading-6 text-foreground-muted sm:text-xs">
          {DEMO_FOOTER}
        </p>
      </div>
    </footer>
  );
}
