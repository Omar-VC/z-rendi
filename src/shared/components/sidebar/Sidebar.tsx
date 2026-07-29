import type { ReactNode } from "react";


interface Props {
  children: ReactNode;
  footer?: ReactNode;
}


export default function Sidebar({
  children,
  footer,
}: Props) {

  return (

    <aside
      className="
        h-full
        flex
        flex-col

        bg-primary/90
        backdrop-blur-xl

        text-white

        p-6

        border-r
        border-white/10

      "
    >

      {children}


      {footer && (
        <div className="mt-auto pt-6">
          {footer}
        </div>
      )}

    </aside>

  );
}