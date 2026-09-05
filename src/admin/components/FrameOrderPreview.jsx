import { useMemo } from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";

/**
 * Parses ratio strings like "8 × 10", "10x12", "4 x 6" to a CSS aspect-ratio value.
 * Default is 4/5 (8 × 10).
 */
function getAspectRatio(ratioString) {
  if (!ratioString) return "4 / 5";
  const match = ratioString.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (match) {
    const w = parseFloat(match[1]);
    const h = parseFloat(match[2]);
    if (w > 0 && h > 0) {
      return `${w} / ${h}`;
    }
  }
  return "4 / 5";
}

/**
 * Get fallback wood gradient and base styling when no texture image is available
 */
function getWoodFallbackStyle(woodName = "") {
  const name = woodName.toLowerCase();
  if (name.includes("rose")) {
    return {
      background: "linear-gradient(135deg, #4A1E18 0%, #30130F 50%, #1F0B08 100%)",
      color: "#F8F6F2",
    };
  }
  if (name.includes("teak")) {
    return {
      background: "linear-gradient(135deg, #8B5A2B 0%, #653E1B 50%, #47290F 100%)",
      color: "#F8F6F2",
    };
  }
  if (name.includes("pine")) {
    return {
      background: "linear-gradient(135deg, #D8B27C 0%, #B88E52 50%, #94713E 100%)",
      color: "#1C1B19",
    };
  }
  if (name.includes("black")) {
    return {
      background: "linear-gradient(135deg, #2D2B29 0%, #1A1918 50%, #0F0E0E 100%)",
      color: "#F8F6F2",
    };
  }
  if (name.includes("walnut")) {
    return {
      background: "linear-gradient(135deg, #42291B 0%, #2D1A10 50%, #1B0F08 100%)",
      color: "#F8F6F2",
    };
  }
  // Default natural wood
  return {
    background: "linear-gradient(135deg, #6E4723 0%, #4D3016 50%, #331E0C 100%)",
    color: "#F8F6F2",
  };
}

/**
 * Returns specific design profile styling (Classic Gold, Modern Black, Vintage Brown, Minimal White)
 * Controls border thickness, inner bevel, outer border, finish, accent color, and decorative profile.
 */
function getDesignProfileStyle(designName = "") {
  const name = (designName || "").toLowerCase();
  if (name.includes("gold")) {
    return {
      borderWidth: "4px",
      innerBorder: "2.5px solid #C9A669",
      outerBorder: "1px solid #9C7B3D",
      boxShadow: "inset 0 0 8px rgba(201,166,105,0.65), 0 0 5px rgba(156,123,61,0.4)",
      finishOverlay: "linear-gradient(135deg, rgba(201,166,105,0.25) 0%, rgba(156,123,61,0.08) 100%)",
      matBackground: "#FAF8F5",
      accentTitle: "Classic Gold Foil Lip",
    };
  }
  if (name.includes("black")) {
    return {
      borderWidth: "3px",
      innerBorder: "2px solid #141312",
      outerBorder: "1px solid #2B2B2B",
      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.85)",
      finishOverlay: "linear-gradient(135deg, rgba(20,20,20,0.4) 0%, rgba(0,0,0,0.7) 100%)",
      matBackground: "#F5F3ED",
      accentTitle: "Matte Ebony Bevel",
    };
  }
  if (name.includes("vintage")) {
    return {
      borderWidth: "6px",
      innerBorder: "3.5px double #523520",
      outerBorder: "2px solid #3E2413",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.75), inset 0 2px 4px rgba(255,255,255,0.18)",
      finishOverlay: "linear-gradient(135deg, rgba(82,53,32,0.35) 0%, rgba(30,15,8,0.6) 100%)",
      matBackground: "#EFEAE1",
      accentTitle: "Antique Heritage Patina",
    };
  }
  if (name.includes("white")) {
    return {
      borderWidth: "3px",
      innerBorder: "2px solid #EAE5D9",
      outerBorder: "1px solid #DCD3C0",
      boxShadow: "inset 0 1px 4px rgba(0,0,0,0.15)",
      finishOverlay: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(245,242,235,0.3) 100%)",
      matBackground: "#FFFFFF",
      accentTitle: "Gallery White Lip",
    };
  }
  return {
    borderWidth: "3px",
    innerBorder: "2px solid #DCD3C0",
    outerBorder: "1px solid #C4BAA3",
    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
    finishOverlay: "transparent",
    matBackground: "#FAF8F5",
    accentTitle: "Standard Finish",
  };
}

export default function FrameOrderPreview({
  order,
  woodTypes = [],
  designs = [],
  className = "",
}) {
  if (!order) return null;

  // Resolve matching wood timber item
  const matchedWood = useMemo(() => {
    return (woodTypes || []).find(
      (w) =>
        (w.name || "").trim().toLowerCase() === (order.woodType || "").trim().toLowerCase() ||
        (w.id || "").trim().toLowerCase() === (order.woodId || "").trim().toLowerCase()
    );
  }, [woodTypes, order.woodType, order.woodId]);

  // Resolve matching design profile item
  const matchedDesign = useMemo(() => {
    return (designs || []).find(
      (d) =>
        (d.name || "").trim().toLowerCase() === (order.frameDesign || "").trim().toLowerCase() ||
        (d.id || "").trim().toLowerCase() === (order.designId || "").trim().toLowerCase()
    );
  }, [designs, order.frameDesign, order.designId]);

  const aspectRatio = getAspectRatio(order.frameRatio);
  const woodTexture = matchedWood?.image || "";
  const designTexture = matchedDesign?.image || "";
  const woodFallback = getWoodFallbackStyle(order.woodType);
  const designProfile = getDesignProfileStyle(order.frameDesign);

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Top Label */}
      <div className="flex items-center justify-center gap-1.5 text-center">
        <Sparkles className="w-3.5 h-3.5 text-[#C9A669]" />
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6D32]">
          Ordered Frame Preview
        </span>
      </div>

      {/* Frame Wall Stage Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#ECE7DC] border border-[#E7E0D2] flex items-center justify-center shadow-inner">
        {/* Realistic Outer Timber Frame */}
        <div
          className="relative max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] w-full rounded-sm p-3.5 sm:p-4 transition-all duration-300"
          style={{
            ...woodFallback,
            ...(woodTexture
              ? {
                  backgroundImage: `url(${woodTexture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}),
            boxShadow:
              "0 20px 40px -12px rgba(0, 0, 0, 0.45), 0 8px 16px -4px rgba(0, 0, 0, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.35), inset -1px -1px 3px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Outer Frame Wood Bevel & Shading Overlay */}
          <div className="absolute inset-0 rounded-sm pointer-events-none bg-gradient-to-br from-white/15 via-transparent to-black/35" />

          {/* Design Profile Layer & Accent Inlay */}
          <div
            className="relative rounded-sm p-1.5 sm:p-2 transition-all overflow-hidden"
            style={{
              backgroundColor: designProfile.matBackground,
              border: designProfile.innerBorder,
              boxShadow: designProfile.boxShadow,
            }}
          >
            {/* Optional Design Profile Texture / Finish Overlay */}
            {designTexture ? (
              <div
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
                style={{
                  backgroundImage: `url(${designTexture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: designProfile.finishOverlay,
                }}
              />
            )}

            {/* Museum Matboard Opening with 45° Bevel Cut Shadow */}
            <div
              className="relative w-full overflow-hidden bg-black/5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.35)] border border-[#E0D9CC]"
              style={{
                aspectRatio,
              }}
            >
              {/* Customer Photo */}
              {order.photoUrl ? (
                <img
                  src={order.photoUrl}
                  alt={order.photoName || "Customer uploaded photo"}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#F4EFE6] text-[#8C6D32]">
                  <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                  <span className="text-[11px] font-semibold">No Image Uploaded</span>
                </div>
              )}

              {/* Protective Art Glass Reflection Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background:
                    "linear-gradient(130deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 45%, transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Frame Specifications Caption */}
      <div className="text-center space-y-1">
        <div className="text-xs sm:text-sm font-bold text-[#1C1B19]">
          {order.woodType} &bull; {order.frameDesign} &bull; {order.frameRatio}
        </div>
        <p className="text-[10px] sm:text-[11px] text-[#8C6D32] italic max-w-xs mx-auto leading-tight">
          Visual representation based on the customer&apos;s selected frame configuration.
        </p>
      </div>
    </div>
  );
}
