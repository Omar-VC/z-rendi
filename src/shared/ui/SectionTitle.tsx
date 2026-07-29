type Props = {
  title: string;
  description?: string;
};


export default function SectionTitle({
  title,
  description,
}: Props) {

  return (
    <div className="mb-5">

      <h1
        className="
          text-2xl
          font-bold
          text-text
        "
      >
        {title}
      </h1>


      {description && (
        <p
          className="
            text-sm
            text-muted
            mt-1
          "
        >
          {description}
        </p>
      )}

    </div>
  );
}