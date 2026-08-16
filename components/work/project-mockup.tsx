import { cn } from "@/lib/utils";

const chromeDots = (
  <div className="flex gap-1.5">
    <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
    <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
  </div>
);

function BrowserFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-navy-950/80 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2">
        {chromeDots}
        <div className="h-4 flex-1 rounded-full bg-white/10" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[9.5rem] rounded-[1.4rem] border border-white/15 bg-navy-950 p-1.5 shadow-[var(--shadow-md)]">
      <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-white/20" />
      <div className="overflow-hidden rounded-[1.05rem] bg-navy-900 p-2">{children}</div>
      <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-white/15" />
    </div>
  );
}

function ShopFlowScreen() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-brand/80" />
        <div className="h-16 rounded-sm bg-navy-800" />
        <div className="h-10 rounded-sm bg-navy-800/80" />
        <div className="h-10 rounded-sm bg-navy-800/60" />
      </div>
      <div className="col-span-2 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-sm bg-white/10 p-1.5">
            <div className="h-8 rounded-sm bg-navy-700" />
            <div className="mt-1.5 h-1.5 w-4/5 rounded-full bg-white/20" />
            <div className="mt-1 h-1.5 w-1/2 rounded-full bg-brand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CarePlusScreen() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {["bg-brand/40", "bg-white/10", "bg-navy-700"].map((tone) => (
        <div key={tone} className="space-y-1.5">
          <div className={`h-1.5 w-2/3 rounded-full ${tone}`} />
          <div className="h-12 rounded-sm bg-white/10" />
          <div className="h-10 rounded-sm bg-white/6" />
          <div className="h-8 rounded-sm bg-white/5" />
        </div>
      ))}
    </div>
  );
}

function FleetProScreen() {
  return (
    <div className="grid grid-cols-[1.1fr_0.9fr] gap-2">
      <div className="relative h-28 overflow-hidden rounded-sm bg-navy-800">
        <div className="absolute inset-3 rounded-sm border border-dashed border-brand/40" />
        <div className="absolute top-6 left-8 h-2 w-2 rounded-full bg-brand" />
        <div className="absolute top-14 right-10 h-2 w-2 rounded-full bg-white/70" />
        <div className="absolute bottom-6 left-1/2 h-2 w-2 rounded-full bg-brand/70" />
      </div>
      <div className="space-y-1.5">
        <div className="h-8 rounded-sm border-l-2 border-brand bg-white/10" />
        <div className="h-8 rounded-sm bg-white/10" />
        <div className="h-8 rounded-sm bg-white/6" />
      </div>
    </div>
  );
}

function LearnHubScreen() {
  return (
    <div className="grid grid-cols-[0.7fr_1.3fr] gap-2">
      <div className="space-y-1.5">
        <div className="h-8 rounded-sm bg-brand/50" />
        <div className="h-6 rounded-sm bg-white/10" />
        <div className="h-6 rounded-sm bg-white/10" />
        <div className="h-6 rounded-sm bg-white/6" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-1/2 rounded-full bg-white/30" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-16 rounded-sm bg-navy-800" />
          <div className="h-16 rounded-sm bg-navy-700" />
        </div>
        <div className="h-8 rounded-sm bg-white/10" />
      </div>
    </div>
  );
}

function EstateProScreen() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-sm bg-white/10">
          <div className={cn("h-10", index % 2 === 0 ? "bg-navy-700" : "bg-navy-800")} />
          <div className="space-y-1 p-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-white/25" />
            <div className="h-1.5 w-1/3 rounded-full bg-brand/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FinServeScreen() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="h-8 flex-1 rounded-sm bg-brand/40" />
        <div className="h-8 flex-1 rounded-sm bg-white/10" />
        <div className="h-8 flex-1 rounded-sm bg-white/10" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-1.5">
          <div className="col-span-2 h-4 rounded-sm bg-white/10" />
          <div className="h-4 rounded-sm bg-white/10" />
          <div className={cn("h-4 rounded-sm", index === 0 ? "bg-brand/50" : "bg-white/6")} />
        </div>
      ))}
    </div>
  );
}

function GymCoreScreen() {
  return (
    <div className="space-y-2">
      <div className="h-2 w-2/3 rounded-full bg-white/30" />
      <div className="grid grid-cols-2 gap-1.5">
        <div className="h-14 rounded-sm bg-brand/50" />
        <div className="h-14 rounded-sm bg-navy-700" />
      </div>
      <div className="h-10 rounded-sm bg-white/10" />
      <div className="h-10 rounded-sm bg-white/10" />
    </div>
  );
}

function FoodHubScreen() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {["#12", "#13", "#14"].map((ticket, index) => (
        <div key={ticket} className="rounded-sm bg-white/10 p-1.5">
          <div className="text-[10px] tracking-wide text-white/50">{ticket}</div>
          <div className={cn("mt-1 h-10 rounded-sm", index === 1 ? "bg-brand/50" : "bg-navy-700")} />
          <div className="mt-1 h-1.5 w-full rounded-full bg-white/15" />
        </div>
      ))}
    </div>
  );
}

function screenFor(slug: string) {
  switch (slug) {
    case "shopflow":
      return <ShopFlowScreen />;
    case "careplus":
      return <CarePlusScreen />;
    case "fleetpro":
      return <FleetProScreen />;
    case "learnhub":
      return <LearnHubScreen />;
    case "estatepro":
      return <EstateProScreen />;
    case "finserve":
      return <FinServeScreen />;
    case "gymcore":
      return <GymCoreScreen />;
    case "foodhub":
      return <FoodHubScreen />;
    default:
      return (
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 rounded-sm bg-navy-800" />
          <div className="col-span-2 space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-brand/70" />
            <div className="h-2 w-full rounded-full bg-white/10" />
            <div className="h-8 rounded-sm bg-white/5" />
          </div>
        </div>
      );
  }
}

export function ProjectMockup({
  slug,
  layout = "browser",
  size = "card",
  caption,
  className,
}: {
  slug: string;
  layout?: "browser" | "device" | "split";
  size?: "card" | "hero" | "feature";
  caption?: string;
  className?: string;
}) {
  const sizeClass =
    size === "hero"
      ? "aspect-[16/10] min-h-0 sm:min-h-[16rem]"
      : size === "feature"
        ? "aspect-[16/10] min-h-0"
        : "aspect-[16/10] max-h-52";
  const screen = screenFor(slug);

  return (
    <div className={cn("relative overflow-hidden rounded-[var(--radius-md)] bg-navy-900 p-2 sm:p-3", sizeClass, className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative flex h-full items-center justify-center">
        {layout === "device" ? (
          <PhoneFrame>{screen}</PhoneFrame>
        ) : layout === "split" ? (
          <div className="grid w-full min-w-0 items-center gap-3 sm:grid-cols-[1.4fr_0.7fr]">
            <BrowserFrame className="min-w-0">{screen}</BrowserFrame>
            <div className="hidden sm:block">
              <PhoneFrame>{screen}</PhoneFrame>
            </div>
          </div>
        ) : (
          <BrowserFrame className="w-full min-w-0">{screen}</BrowserFrame>
        )}
      </div>
      {caption ? (
        <p className="relative mt-2 text-center text-[11px] tracking-wide text-white/50 uppercase">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
