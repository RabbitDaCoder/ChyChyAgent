import PropTypes from "prop-types";
import { Home } from "lucide-react";

export default function ImageWithFallback({ src, alt, className = "", ...rest }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-soft text-text-muted ${className}`}>
        <Home size={20} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={(e) => (e.target.src = "")} {...rest} />;
}

ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};
