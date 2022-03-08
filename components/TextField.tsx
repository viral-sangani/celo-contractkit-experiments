import { ChangeEventHandler } from "react";

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  type: "text" | "password";
  placeholder?: string;
  varient?: "ongray";
}
export const TextField: React.FC<Props> = ({
  onChange,
  value,
  type,
  placeholder,
  varient,
}) => {
  if (varient === "ongray") {
    return (
      <input
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="px-3 py-1 font-sourceSansPro text-base bg-white hover:bg-white focus:bg-white rounded-lg border-4 hover:border-4 border-transparent hover:border-blue-200 focus:border-blue-200 outline-none focus:outline-none focus:ring w-full pr-10 transition-all duration-500 ring-transparent"
      />
    );
  }
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="px-3 py-1 font-sourceSansPro text-lg bg-gray-100 hover:bg-white focus:bg-white rounded-lg border-4 hover:border-4 border-transparent hover:border-blue-200 focus:border-blue-200 outline-none focus:outline-none focus:ring w-full pr-10 transition-all duration-500 ring-transparent"
    />
  );
};
