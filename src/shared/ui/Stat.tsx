import type { ReactNode } from "react";

interface Props {
  title: string;
  value: ReactNode;
}

export default function Stat({
  title,
  value,
}: Props) {
  return (
    <div className="space-y-1">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-lg font-semibold text-primary">
        {value}
      </p>

    </div>
  );
}