import { createPortal } from "react-dom";
import { formatRupee } from "../lib/framePricing";

/**
 * Format date string to "DD Month YYYY", e.g. "05 September 2026"
 */
function formatReceiptDate(dateString) {
  if (!dateString) {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function FramePrintReceipt({ order }) {
  if (!order || typeof document === "undefined") return null;

  const formattedDate = formatReceiptDate(order.createdAt);
  const woodPrice = order.woodPrice ?? 800;
  const designPrice = order.designPrice ?? 0;
  const ratioPrice = order.ratioPrice ?? 1200;
  const totalAmount = order.totalAmount ?? (woodPrice + designPrice + ratioPrice);

  const receiptContent = (
    <div
      id="frame-print-receipt"
      className="frame-receipt-print-only bg-white text-[#1C1B19] font-sans mx-auto"
    >
      <div className="border border-gray-300 p-8 max-w-[620px] mx-auto rounded-none print:border-gray-400 print:p-6 print-avoid-break space-y-5">
        {/* ==========================================================
            RECEIPT HEADER
        ========================================================== */}
        <div className="text-center space-y-1.5 border-b border-gray-200 pb-5 print:border-gray-300">
          <div className="text-[10px] tracking-[0.25em] font-semibold text-[#8C6D32] uppercase">
            ATELIER WOODCRAFT &amp; FRAMING
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-widest uppercase text-[#1C1B19]">
            SUBASH STUDIO
          </h1>
          <p className="text-xs text-gray-500 italic">
            Fine Photography &amp; Cinematic Films
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1 border border-gray-300 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1C1B19] bg-[#FAF8F5] print:bg-transparent">
              FRAME ORDER RECEIPT
            </span>
          </div>
        </div>

        {/* ==========================================================
            ORDER INFORMATION (3-COLUMN AREA)
        ========================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-b border-gray-200 pb-4 print:border-gray-300">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              ORDER ID
            </div>
            <div className="font-mono font-bold text-sm text-[#1C1B19] mt-0.5">
              {order.id}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              ORDER DATE
            </div>
            <div className="font-medium text-xs text-[#1C1B19] mt-0.5">
              {formattedDate}
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
              STATUS
            </div>
            <div className="font-bold text-xs text-[#1C1B19] uppercase mt-0.5">
              {order.status || "NEW"}
            </div>
          </div>
        </div>

        {/* ==========================================================
            CUSTOMER DETAILS
        ========================================================== */}
        <div className="space-y-2 border-b border-gray-200 pb-4 print:border-gray-300 print-avoid-break">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#1C1B19]">
            CUSTOMER DETAILS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-xs">
            <div>
              <span className="text-gray-500">Name: </span>
              <span className="font-semibold text-[#1C1B19]">{order.customerName}</span>
            </div>
            <div>
              <span className="text-gray-500">Phone: </span>
              <span className="font-mono text-[#1C1B19]">{order.phone}</span>
            </div>
            <div>
              <span className="text-gray-500">WhatsApp: </span>
              <span className="font-mono text-[#1C1B19]">{order.whatsapp || order.phone}</span>
            </div>
            <div>
              <span className="text-gray-500">Email: </span>
              <span className="text-[#1C1B19]">{order.email}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500">Fulfillment: </span>
              <span className="font-semibold text-[#1C1B19]">{order.deliveryType || "Home Delivery"}</span>
            </div>
            {order.address && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Delivery Address: </span>
                <span className="text-[#1C1B19] leading-relaxed">{order.address}</span>
              </div>
            )}
            {order.notes && (
              <div className="sm:col-span-2 text-[11px] text-gray-600 italic">
                <span>Instructions: </span>
                <span>{order.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================================
            FRAME SPECIFICATION
        ========================================================== */}
        <div className="space-y-2 border-b border-gray-200 pb-4 print:border-gray-300 print-avoid-break">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#1C1B19]">
            FRAME SPECIFICATION
          </div>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">Wood Type</span>
              <span className="font-semibold text-[#1C1B19]">{order.woodType}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">Frame Design</span>
              <span className="font-semibold text-[#1C1B19]">{order.frameDesign}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">Frame Ratio</span>
              <span className="font-semibold text-[#1C1B19]">{order.frameRatio}</span>
            </div>
          </div>
        </div>

        {/* ==========================================================
            PRICE BREAKDOWN
        ========================================================== */}
        <div className="space-y-2 border-b border-gray-200 pb-4 print:border-gray-300 print-avoid-break">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#1C1B19]">
            PRICE BREAKDOWN
          </div>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">Wood Base Price</span>
              <span className="font-mono text-[#1C1B19]">{formatRupee(woodPrice)}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">Frame Design</span>
              <span className="font-mono text-[#1C1B19]">{formatRupee(designPrice)}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">Size / Ratio Price</span>
              <span className="font-mono text-[#1C1B19]">{formatRupee(ratioPrice)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2.5 flex justify-between items-center">
              <span className="font-bold text-sm uppercase tracking-wider text-[#1C1B19]">
                TOTAL
              </span>
              <span className="font-mono font-bold text-base sm:text-lg text-[#1C1B19]">
                {formatRupee(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================================
            BOTTOM SECTION
        ========================================================== */}
        <div className="text-center space-y-2 pt-1 print-avoid-break">
          <div className="text-xs text-gray-600">
            Order Status: <span className="font-semibold text-[#1C1B19]">{order.status || "New"}</span>
          </div>
          <div className="text-xs font-serif text-[#1C1B19]">
            Thank you for choosing <span className="font-bold">SUBASH STUDIO</span>.
          </div>
          <p className="text-[11px] text-[#8C6D32] italic">
            A fine photography and cinematography house.
          </p>
        </div>

        {/* ==========================================================
            STUDIO CONTACT & LEGAL DISCLAIMER
        ========================================================== */}
        <div className="text-center text-[10px] text-gray-500 border-t border-gray-200 pt-3.5 print:border-gray-300 print-avoid-break space-y-1">
          <div>
            Tirunelveli Atelier &bull; Kalladaikurichi Heritage Studio
          </div>
          <div>
            Direct Inquiries: +91 93457 06609 &bull; subashstudio002@gmail.com
          </div>
          <div className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 pt-1">
            THIS IS AN OFFICIAL COMPUTER-GENERATED RECEIPT FOR CUSTOM FRAMING ORDER.
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(receiptContent, document.body);
}

