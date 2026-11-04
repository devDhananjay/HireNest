export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 pt-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-[2rem] font-semibold tracking-tight sm:text-[2.35rem]">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
