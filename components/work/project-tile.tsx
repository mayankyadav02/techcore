import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { ProjectMockup } from "@/components/work/project-mockup";
import type { Project } from "@/lib/content/projects";
import { primaryFilterLabel } from "@/lib/work/portfolio-filters";

export function ProjectTile({ project }: { project: Project }) {
  const category = primaryFilterLabel(project);
  const kind = project.kind ?? "Fictional Case Study";

  return (
    <Card interactive className="flex h-full flex-col overflow-hidden p-0">
      <div className="p-3 pb-0">
        <FadeIn>
          <ProjectMockup
            slug={project.slug}
            layout={project.mockupLayout === "split" ? "browser" : project.mockupLayout}
            size="card"
          />
        </FadeIn>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs tracking-[0.14em] text-brand-dark uppercase">{category}</p>
          <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] tracking-wide text-ink-subtle uppercase">
            {kind}
          </span>
        </div>
        <h3 className="mt-2 text-[1.35rem] font-semibold text-ink">
          <Link href={`/projects/${project.slug}`} className="hover:text-brand-dark">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">
          {project.pitch || project.summary}
        </p>
        {project.technology.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technology.slice(0, 4).map((item) => (
              <li
                key={item}
                className="rounded-[var(--radius-sm)] border border-line bg-surface px-2 py-1 text-xs text-ink-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-brand-dark hover:underline"
        >
          View Case Study
        </Link>
      </div>
    </Card>
  );
}
