import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface Props {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function FormField({ label, name, type = "text", value = "", onChange = () => {} }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event)}
        name={name}
        id={name}
        className="w-full transition-colors border border-gray-800
              hover:border-emerald-400 rounded-md p-1"
      />
    </div>
  );
}

export default FormField;
