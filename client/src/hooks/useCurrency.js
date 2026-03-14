import { useEffect, useState } from "react";
import axios from "axios";
import { CURRENCY_MAP, convertPrice } from "../utils/currency";

let cachedCountry = null;
let cachedTime = null;
let detectPromise = null;

export function useCurrency() {
  const [currency, setCurrency] = useState(CURRENCY_MAP.DEFAULT);
  const [loading, setLoading] = useState(true);
  const [usePPP, setUsePPP] = useState(true);

  useEffect(() => {
    async function detect() {
      const localCountry = localStorage.getItem("chychyagent_country");
      const localTime = Number(localStorage.getItem("chychyagent_country_time"));
      const now = Date.now();

      const memoCountry = cachedCountry || localCountry;
      const memoTime = cachedTime || localTime;
      const isExpired = !memoTime || now - memoTime > 86400000;

      let countryCode = memoCountry;

      if (!countryCode || isExpired) {
        if (!detectPromise) {
          detectPromise = axios
            .get("https://ipapi.co/json/")
            .then((res) => res.data.country_code)
            .catch(() => "DEFAULT")
            .finally(() => {
              cachedTime = Date.now();
            });
        }
        countryCode = await detectPromise;
        cachedCountry = countryCode;
        cachedTime = Date.now();
        localStorage.setItem("chychyagent_country", countryCode);
        localStorage.setItem("chychyagent_country_time", String(Date.now()));
        detectPromise = null;
      }

      setCurrency(CURRENCY_MAP[countryCode] || CURRENCY_MAP.DEFAULT);
      setLoading(false);
    }
    detect();
  }, []);

  return {
    currency,
    loading,
    usePPP,
    togglePPP: () => setUsePPP((p) => !p),
    format: (usdAmount) => convertPrice(usdAmount, currency, usePPP),
  };
}
