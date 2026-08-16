import { processSteps } from "@/lib/content/home";

export function ProcessSteps() {
  return (
    <div className="relative mt-10 sm:mt-12">
      {/* Desktop connector */}
      <div
        aria-hidden="true"
        className="absolute top-[1.35rem] right-[6%] left-[6%] hidden h-px bg-gradient-to-r from-brand/10 via-brand/45 to-brand/10 xl:block"
      />

      {/* Mobile connector */}
      <div
        aria-hidden="true"
        className="absolute top-5 bottom-5 left-[1.25rem] w-px bg-brand/25 xl:hidden"
      />

      <ol className="grid gap-7 xl:grid-cols-7 xl:gap-3">
        {processSteps.map((step, index) => (
          <li
            key={step.title}
            className="group relative flex min-w-0 gap-4 xl:flex-col xl:items-center xl:gap-0 xl:text-center"
          >
            {/* Step number */}
            <span
              className="
                relative z-10 flex h-10 w-10 shrink-0 items-center justify-center
                rounded-full border border-brand/35
                bg-elevated text-xs font-semibold text-brand-dark
                shadow-[0_0_0_5px_var(--surface)]
                transition-all duration-300
                group-hover:border-brand
                group-hover:bg-brand
                group-hover:text-white
                group-hover:shadow-[0_0_0_5px_var(--surface),0_0_20px_rgb(0_200_120_/_0.18)]
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Content */}
            <div
              className="
                min-w-0 flex-1 rounded-[var(--radius-lg)]
                border border-transparent
                px-1 pt-0.5
                transition-all duration-300
                group-hover:border-line
                group-hover:bg-elevated/60
                group-hover:px-4
                group-hover:py-4
                xl:mt-6 xl:w-full xl:px-3 xl:py-4
                xl:group-hover:-translate-y-1
                xl:group-hover:px-4
              "
            >
              <p className="text-[0.65rem] font-medium tracking-[0.16em] text-brand-dark uppercase">
                Step {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-2 text-base font-semibold tracking-tight text-ink sm:text-lg">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}