export const CURRENCY_MAP = {
  NG: { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1580, ppp: 0.28 },
  US: { code: "USD", symbol: "$", name: "US Dollar", rate: 1, ppp: 1.0 },
  GB: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79, ppp: 0.68 },
  GH: { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", rate: 15.2, ppp: 0.35 },
  KE: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 129, ppp: 0.32 },
  ZA: { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.6, ppp: 0.38 },
  CA: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36, ppp: 0.82 },
  DE: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, ppp: 0.72 },
  DEFAULT: { code: "USD", symbol: "$", name: "US Dollar", rate: 1, ppp: 1.0 },
};

// Update rates periodically or integrate a live rates API like exchangerate-api.com free tier

export function convertPrice(usdAmount, currencyInfo, usePPP = true) {
  const factor = usePPP ? currencyInfo.rate * currencyInfo.ppp : currencyInfo.rate;
  const converted = usdAmount * factor;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyInfo.code,
    maximumFractionDigits: 0,
  }).format(converted);
}
