import PropTypes from "prop-types";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-soft/70 ${className}`}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};
