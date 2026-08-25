import "./Input.css";

export default function Input({
  label,
  error,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  required = false,
  className = "",
  ...rest
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? "input-error" : ""}`}
        {...rest}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
