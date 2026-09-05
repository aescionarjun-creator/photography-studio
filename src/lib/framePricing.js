// @ts-check

/**
 * Parses numeric price from string (e.g. "₹800", "800", 800)
 * @param {string | number | undefined | null} priceVal
 * @returns {number}
 */
export function parsePrice(priceVal) {
  if (typeof priceVal === "number") return isNaN(priceVal) ? 0 : priceVal;
  if (!priceVal) return 0;
  const cleaned = String(priceVal).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats a number to Indian Rupee currency format (e.g. "₹2,000")
 * @param {number} amount
 * @returns {string}
 */
export function formatRupee(amount) {
  const rounded = Math.round(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Centralized frame order pricing calculator.
 * Formula:
 * FINAL PRICE = Wood Base Price + Design Additional Price + Ratio/Size Price
 * 
 * @param {Object} params
 * @param {Object} [params.wood]
 * @param {Object} [params.design]
 * @param {Object} [params.ratio]
 * @returns {{
 *   woodPrice: number,
 *   designPrice: number,
 *   ratioPrice: number,
 *   totalAmount: number,
 *   formattedWoodPrice: string,
 *   formattedDesignPrice: string,
 *   formattedRatioPrice: string,
 *   formattedTotal: string
 * }}
 */
export function calculateFramePrice({ wood, design, ratio }) {
  const woodPrice = wood ? parsePrice(wood.price || wood.basePrice) : 0;
  const designPrice = design ? parsePrice(design.additionalPrice || design.price) : 0;
  const ratioPrice = ratio ? parsePrice(ratio.price) : 0;

  const totalAmount = woodPrice + designPrice + ratioPrice;

  return {
    woodPrice,
    designPrice,
    ratioPrice,
    totalAmount,
    formattedWoodPrice: formatRupee(woodPrice),
    formattedDesignPrice: formatRupee(designPrice),
    formattedRatioPrice: formatRupee(ratioPrice),
    formattedTotal: formatRupee(totalAmount),
  };
}

/**
 * Checks whether a frame design is compatible with a given wood type.
 * If design.compatibleWoods is missing or empty or contains "All", it is compatible with all woods.
 * Otherwise, checks if wood.id or wood.name is in design.compatibleWoods.
 * 
 * @param {Object} design
 * @param {Object} wood
 * @returns {boolean}
 */
export function isDesignCompatible(design, wood) {
  if (!design || !wood) return false;
  if (!design.compatibleWoods || design.compatibleWoods.length === 0) return true;
  if (design.compatibleWoods.includes("All")) return true;

  const woodId = String(wood.id || "").toLowerCase();
  const woodName = String(wood.name || "").toLowerCase();

  return design.compatibleWoods.some((w) => {
    const target = String(w).toLowerCase();
    return target === woodId || target === woodName;
  });
}

/**
 * Normalizes a phone number for WhatsApp wa.me links.
 * Strips non-digits; handles 10-digit Indian numbers by prefixing 91.
 * 
 * @param {string | number | undefined | null} phone
 * @returns {string}
 */
export function normalizeWhatsAppNumber(phone) {
  if (!phone) return "";
  let cleaned = String(phone).replace(/[^0-9]/g, "");
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

