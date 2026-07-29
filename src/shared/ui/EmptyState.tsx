import type { ReactNode } from "react";


interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
}


export default function EmptyState({
  title,
  description,
  action,
}: Props) {

  return (
    <div
      className="
        py-10
        text-center
      "
    >

      <h3
        className="
          text-lg
          font-semibold
          text-text
        "
      >
        {title}
      </h3>


      {description && (
        <p
          className="
            mt-2
            text-muted
          "
        >
          {description}
        </p>
      )}


      {action && (
        <div
          className="
            mt-6
          "
        >
          {action}
        </div>
      )}

    </div>
  );
}