import PropTypes from "prop-types";

const base =
  "w-full bg-surface border border-border rounded-md px-4 py-3 text-body-md text-text-primary placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition";

export default function Input({ label, helperText, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-2 text-label text-text-muted">
      {label && <span className="font-medium">{label}</span>}
      <input className={`${base} ${className}`} {...props} />
      {helperText && <span className="text-text-light">{helperText}</span>}
    </label>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
};
