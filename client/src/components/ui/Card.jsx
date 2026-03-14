import PropTypes from "prop-types";

export default function Card({ children, className = "", hover = false }) {
  const classes = [
    "bg-surface border border-border rounded-lg shadow-card transition-transform transition-shadow duration-200",
    hover ? "hover:-translate-y-0.5 hover:shadow-hover" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};
