import PropTypes from "prop-types";

export default function Badge({ children, className = "" }) {
  const classes = `inline-flex items-center gap-1 px-3 py-1 rounded-pill bg-accent-soft text-primary-dark font-mono text-label uppercase tracking-wide ${className}`;
  return <span className={classes}>{children}</span>;
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
