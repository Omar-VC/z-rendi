type Props = {
  title: string;
  description?: string;
};


export default function SectionTitle({
  title,
  description,
}: Props) {

  return (
    <div className="mb-6">

      <h1 className="text-2xl font-bold text-primary">
        {title}
      </h1>


      {description && (
        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>
      )}

    </div>
  );
}