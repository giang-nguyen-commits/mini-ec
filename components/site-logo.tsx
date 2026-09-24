export function SiteLogo() {
  return (
    <span className="flex items-start gap-2.5 sm:gap-3">
      <svg
        viewBox="0 0 72 72"
        className="mt-[2px] h-[34px] w-[34px] shrink-0 sm:mt-[3px] sm:h-10 sm:w-10"
        aria-hidden="true"
      >
        <circle cx="36" cy="36" r="34" fill="#f8e6ec" />
        <circle
          cx="36"
          cy="36"
          r="33"
          fill="none"
          stroke="#7c2942"
          strokeWidth="3"
        />
        <circle
          cx="36"
          cy="36"
          r="27.5"
          fill="none"
          stroke="#c4a07a"
          strokeWidth="1.6"
        />
        <text
          x="36"
          y="37"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#7c2942"
          className="[font-family:var(--font-display),serif]"
          fontSize="32"
          fontWeight="700"
        >
          G
        </text>
        <path
          d="M50 14c6 8 3 16-3 19"
          fill="none"
          stroke="#7c2942"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M54 16c4.2 1.4 6.4 6.2 3.6 10.2-2.4-1.2-5.2-3.6-5.8-7.4 1.2-1.2 1.8-2 2.2-2.8z"
          fill="#7c2942"
        />
      </svg>
      <span className="flex flex-col items-center leading-none">
        <span className="pl-[0.12em] font-[family-name:var(--font-display)] text-[32px] font-semibold tracking-[0.12em] text-forest-strong sm:text-[40px]">
          Giang
        </span>
        <span className="mt-1 pl-[0.36em] text-[9px] font-medium tracking-[0.36em] text-forest sm:text-[10px]">
          COSMETIC
        </span>
      </span>
    </span>
  );
}
