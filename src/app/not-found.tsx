import Link from "next/link";
import { Search } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="container-shell py-24 text-center">
      <div className="flex justify-center">
        <IconOrb icon={Search} />
      </div>
      <h1 className="mt-6 font-heading text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">That route is not part of the HIREORA workspace.</p>
      <Link href="/" className={`${btnPrimary} mt-8`}>
        Back home
      </Link>
    </div>
  );
}
