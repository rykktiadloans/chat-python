interface Props {
  name: string;
  label: string;
}

function FormField({ label, name }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        className="w-full transition-colors border border-gray-800
              hover:border-emerald-400 rounded-md p-1"
      />
    </div>
  );
}

export default FormField;
