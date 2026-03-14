import PropTypes from "prop-types";
import Skeleton from "./Skeleton";
import { useCurrency } from "../../hooks/useCurrency";

export default function PriceDisplay({ usdAmount, className = "" }) {
  const { currency, loading, usePPP, togglePPP, format } = useCurrency();

  if (loading) {
    return <Skeleton className="h-8 w-32" />;
  }

  return (
    <div className={className}>
      <div className="text-display-md font-semibold text-primary" title={currency.name}>
        {format(usdAmount)}
      </div>
      <div className="flex items-center gap-2 text-label text-text-muted">
        <button
          type="button"
          className="underline decoration-primary underline-offset-4"
          onClick={togglePPP}
          title="Purchasing Power Parity adjusts the price to reflect local affordability."
        >
          {usePPP ? "PPP adjusted" : "Standard rate"}
        </button>
        <span className="text-text-light">
          (Originally ${usdAmount.toLocaleString()} USD)
        </span>
      </div>
    </div>
  );
}

PriceDisplay.propTypes = {
  usdAmount: PropTypes.number.isRequired,
  className: PropTypes.string,
};
