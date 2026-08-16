import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ListFilters({
  action,
  searchName = "q",
  searchPlaceholder = "Search",
  searchDefault = "",
  filters,
}: {
  action: string;
  searchName?: string;
  searchPlaceholder?: string;
  searchDefault?: string;
  filters?: React.ReactNode;
}) {
  return (
    <form
      action={action}
      method="get"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-0 flex-1 sm:min-w-[12rem]">
        <Input
          name={searchName}
          defaultValue={searchDefault}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>
      {filters}
      <Button type="submit" variant="outline">
        Apply
      </Button>
    </form>
  );
}

export function FilterSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="w-full sm:w-44">
      <Select name={name} defaultValue={defaultValue ?? ""} aria-label={label}>
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
