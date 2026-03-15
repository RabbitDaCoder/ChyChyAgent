import PropTypes from "prop-types";

const AnalyticsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center gap-3 text-text-muted">
        <div className="rounded-full bg-accent-soft p-2">
          <Icon size={18} className="text-primary" />
        </div>
        <span className="text-label">{title}</span>
      </div>
      <p className="mt-2 font-display text-display-md text-text-primary">
        {value}
      </p>
    </div>
  );
};
AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AnalyticsCard;
