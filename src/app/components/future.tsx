import { Truck, ShieldCheck, BadgePercent } from "lucide-react";

export const FutureCustom = () => {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Feature
            icon={Truck}
            title="Free shipping $49+"
            desc="Fast, carbon‑neutral delivery"
          />
          <Feature
            icon={ShieldCheck}
            title="Clean beauty"
            desc="Dermatologist tested, cruelty‑free"
          />
          <Feature
            icon={BadgePercent}
            title="Member perks"
            desc="Early drops & exclusive deals"
          />
        </div>
      </section>
    </>
  );
};

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted p-4">
      <div className="rounded-xl bg-background p-2 shadow">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
