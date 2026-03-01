export const Required = ({ required }: { required?: boolean }) => {
  return required ? <span className="text-red-400">*</span> : ""
}
