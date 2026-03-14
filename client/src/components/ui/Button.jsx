import PropTypes from "prop-types";
const merge = (...classes) => classes.filter(Boolean).join(" ");

const baseStyles =
  "inline-flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-dark rounded-pill px-7 py-3 font-medium shadow-soft hover:shadow-hover",
  secondary:
    "border border-primary text-primary hover:bg-primary-light rounded-pill px-7 py-3 font-medium shadow-soft hover:shadow-hover",
  ghost:
    "text-text-muted hover:text-primary hover:bg-surface-soft rounded-pill px-5 py-3 font-medium",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "",
  lg: "text-[1.05rem] px-8 py-3.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as = "button",
  ...props
}) {
  const classes = merge(baseStyles, variants[variant], sizes[size], className);
  const Component = as;
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  as: PropTypes.elementType,
};
