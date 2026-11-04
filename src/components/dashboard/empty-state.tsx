import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.85rem] bg-white px-6 py-16 text-center shadow-soft">
      <span className="icon-orb size-14">
        <Inbox className="size-5 text-muted-foreground" />
      </span>
      <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
