import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-[#f3f4f8] lg:grid-cols-2">
      <div className="mesh-dark relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col">
        <Logo light />
        <div className="pointer-events-none absolute -right-16 -bottom-24 font-heading text-[18rem] leading-none font-semibold text-white/[0.04]">
          H
        </div>
        <div className="mt-auto max-w-md pb-10">
          <p className="text-[12px] font-medium tracking-[0.18em] text-white/45 uppercase">HIREORA</p>
          <h1 className="mt-3 font-heading text-5xl leading-[1.08] font-semibold">Connecting talent. Creating possibilities.</h1>
          <p className="mt-5 text-sm leading-7 text-white/65">
            {BRAND.tagline} Role-based access for candidates, employers and consultants.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 p-5 sm:p-6">
        <div className="w-full max-w-md lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-md rounded-[1.6rem] bg-white p-6 shadow-soft sm:rounded-[2rem] sm:p-10">{children}</div>
      </div>
    </div>
  );
}
