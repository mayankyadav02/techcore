import { Container } from "@/components/ui/container";
import { trustItems } from "@/lib/content/home";

export function TrustStrip() {
  return (
    <div className="border-y border-line bg-elevated">
      <Container>
        <ul className="grid grid-cols-1 gap-px bg-line min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {trustItems.map((item) => (
            <li
              key={item}
              className="flex min-h-11 items-center justify-center bg-elevated px-3 py-4 text-center text-[0.8125rem] font-medium text-ink sm:py-5 sm:text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
