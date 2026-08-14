import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="px-5 py-24">
      <EmptyState
        title="Page not found"
        description="The page you requested does not exist or is no longer published."
        action={<ButtonLink href="/">Back to home</ButtonLink>}
      />
    </div>
  );
}
