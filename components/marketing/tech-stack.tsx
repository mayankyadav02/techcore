import { technologies } from "@/lib/content/home";

export function TechStack() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {technologies.map((item) => (
        <li
          key={item}
          className="
            group relative flex min-h-14 min-w-0 items-center
            justify-between overflow-hidden
            rounded-[var(--radius-lg)]
            border border-line
            bg-elevated/80
            px-5 py-4
            text-sm font-medium text-ink
            shadow-[var(--shadow-sm)]
            transition-all duration-300
            hover:-translate-y-1
            hover:border-brand/50
            hover:bg-brand/5
            hover:shadow-[var(--shadow-md)]
          "
        >
          {/* Subtle hover glow */}
          <span
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-r from-brand/0 via-brand/5 to-brand/0
              opacity-0 transition-opacity duration-300
              group-hover:opacity-100
            "
            aria-hidden="true"
          />

          <span className="relative transition-colors duration-300 group-hover:text-brand-dark">
            {item}
          </span>

          {/* Premium indicator */}
          <span
            className="
              relative h-2 w-2 shrink-0 rounded-full
              bg-brand/30
              transition-all duration-300
              group-hover:scale-125
              group-hover:bg-brand
              group-hover:shadow-[0_0_12px_var(--brand)]
            "
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
}