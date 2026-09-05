import { useState, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  MapPin,
  FileText,
} from "lucide-react";
import FramePrintReceipt from "../components/FramePrintReceipt";
import { useAdminData } from "../admin/context/AdminDataContext";
import {
  calculateFramePrice,
  formatRupee,
  isDesignCompatible,
} from "../lib/framePricing";


const STEPS = [
  { id: 1, label: "Wood", desc: "Select timber" },
  { id: 2, label: "Design", desc: "Choose finish" },
  { id: 3, label: "Photo", desc: "Upload & protect" },
  { id: 4, label: "Size", desc: "Aspect & scale" },
  { id: 5, label: "Review", desc: "Pricing summary" },
  { id: 6, label: "Details", desc: "Shipping & info" },
  { id: 7, label: "Success", desc: "Confirmation" },
];

export default function OrderFrames() {
  const fileInputId = useId();
  const {
    frameWoodTypes,
    frameDesigns,
    frameRatios,
    addFrameOrder,
  } = useAdminData();

  // Active items from admin context
  const activeWoods = (frameWoodTypes || []).filter((w) => w.active !== false);
  const activeDesigns = (frameDesigns || []).filter((d) => d.active !== false);
  const activeRatios = (frameRatios || []).filter((r) => r.active !== false);

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWood, setSelectedWood] = useState(() => activeWoods[0] || null);
  const [selectedDesign, setSelectedDesign] = useState(() => activeDesigns[0] || null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [selectedRatio, setSelectedRatio] = useState(() => activeRatios[1] || activeRatios[0] || null);

  // Customer Details Form State
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    deliveryType: "Home Delivery",
    address: "",
    branchPickup: "Tirunelveli Branch",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const fileInputRef = useRef(null);

  // Centralized pricing
  const pricing = calculateFramePrice({
    wood: selectedWood,
    design: selectedDesign,
    ratio: selectedRatio,
  });

  // Photo compression helper using canvas
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setPhotoError("");
    setPhotoFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress and scale photo to max 800px dimension
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-friendly JPEG data URL ~ 60-100KB
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        setUploadedPhoto(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Step advancement validation
  const canGoNext = () => {
    if (currentStep === 1) return !!selectedWood;
    if (currentStep === 2) return !!selectedDesign;
    if (currentStep === 3) return !!uploadedPhoto;
    if (currentStep === 4) return !!selectedRatio;
    if (currentStep === 5) return true;
    if (currentStep === 6) return true;
    return false;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setCurrentStep((s) => Math.min(s + 1, 7));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Form submission
  const validateForm = () => {
    const errs = {};
    if (!customerForm.name.trim()) errs.name = "Full name is required.";
    if (!customerForm.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^[0-9+-\s()]{7,16}$/.test(customerForm.phone.trim())) {
      errs.phone = "Please enter a valid contact number.";
    }
    if (!customerForm.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (customerForm.deliveryType === "Home Delivery" && !customerForm.address.trim()) {
      errs.address = "Delivery address is required for home shipping.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const rand = Math.floor(100 + Math.random() * 900);
      const generatedOrderId = `SS-FR-${today}-${rand}`;

      const orderPayload = {
        id: generatedOrderId,
        customerName: customerForm.name.trim(),
        phone: customerForm.phone.trim(),
        whatsapp: customerForm.whatsapp.trim() || customerForm.phone.trim(),
        email: customerForm.email.trim(),
        deliveryType: customerForm.deliveryType,
        address:
          customerForm.deliveryType === "Home Delivery"
            ? customerForm.address.trim()
            : `Pickup at ${customerForm.branchPickup}`,
        notes: customerForm.notes.trim(),
        woodType: selectedWood?.name || "Selected Wood",
        woodPrice: pricing.woodPrice,
        frameDesign: selectedDesign?.name || "Selected Design",
        designPrice: pricing.designPrice,
        frameRatio: selectedRatio?.name || "Selected Size",
        ratioPrice: pricing.ratioPrice,
        totalAmount: pricing.totalAmount,
        photoUrl: uploadedPhoto || "/images/couple.jpg",
        photoName: photoFileName || "customer-uploaded-photo.jpg",
        status: "New",
        createdAt: new Date().toISOString(),
      };

      addFrameOrder(orderPayload);
      setPlacedOrder(orderPayload);
      setIsSubmitting(false);
      setCurrentStep(7);
      window.scrollTo({ top: 100, behavior: "smooth" });
    }, 600);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8F6F2] text-[#2B2B2B] pt-28 pb-20 px-4 sm:px-6 lg:px-10 no-print">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Title & Breadcrumb */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE3D2] text-[#8C6D32] text-xs font-semibold tracking-wider uppercase border border-[#DCD3C0]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A669]" />
            <span>Atelier Handcrafted Framing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#1C1B19]">
            Design Your Heirloom Frame
          </h1>
          <p className="text-sm sm:text-base text-[#6F6A62] max-w-2xl mx-auto leading-relaxed">
            Select premium timber, artisan finishes, upload your photograph with client-side protection, and tailor your frame with transparent pricing.
          </p>
        </div>

        {/* 7-Step Progress Navigator */}
        <nav aria-label="Order progress" className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E7E0D2] shadow-sm overflow-x-auto min-w-0">
          <div className="flex items-center justify-between min-w-[580px] sm:min-w-0">
            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    disabled={step.id > currentStep && currentStep !== 7}
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all ${
                      isCurrent
                        ? "bg-[#1C1B19] text-[#F8F6F2] shadow"
                        : isCompleted
                        ? "hover:bg-[#F8F6F2] text-[#1C1B19] cursor-pointer"
                        : "text-[#9E988E] cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? "bg-[#C9A669] text-[#1C1B19]"
                          : isCompleted
                          ? "bg-[#EAE3D2] text-[#8C6D32]"
                          : "border border-[#DCD3C0] text-[#9E988E]"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <div className="text-xs font-bold leading-none truncate">{step.label}</div>
                      <div className={`text-[10px] mt-0.5 truncate ${isCurrent ? "text-[#C9A669]" : "text-[#9E988E]"}`}>
                        {step.desc}
                      </div>
                    </div>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 transition-colors ${
                        isCompleted ? "bg-[#C9A669]" : "bg-[#E7E0D2]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Wizard Main Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E7E0D2] shadow-sm min-w-0">
          <AnimatePresence mode="wait">
            {/* ==========================================================
                STEP 1: SELECT WOOD TYPE
            ========================================================== */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E7E0D2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1B19]">
                      Step 1: Choose Timber Wood Type
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F6A62]">
                      Each timber species offers distinct natural grain patterns, weight, and organic color tone.
                    </p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 bg-[#F8F6F2] border border-[#E7E0D2] rounded-full text-[#8C6D32] self-start sm:self-auto">
                    Base Wood Pricing
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeWoods.map((wood) => {
                    const isSelected = selectedWood?.id === wood.id;
                    return (
                      <div
                        key={wood.id}
                        onClick={() => setSelectedWood(wood)}
                        className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all p-4 flex flex-col justify-between relative ${
                          isSelected
                            ? "border-[#C9A669] ring-2 ring-[#C9A669]/20 bg-[#FDFBF7] shadow-md"
                            : "border-[#E7E0D2] hover:border-[#C9A669]/60 hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative h-44 rounded-xl overflow-hidden bg-[#ECE7DC] border border-[#E7E0D2]">
                            <img
                              src={wood.image}
                              alt={wood.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C9A669] text-[#1C1B19] flex items-center justify-center shadow">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#1C1B19]/80 backdrop-blur-sm text-[#F8F6F2] text-[11px] font-semibold">
                              {formatRupee(wood.basePrice)} base
                            </div>
                          </div>

                          <div>
                            <h3 className="font-display font-bold text-base text-[#1C1B19] flex items-center justify-between">
                              <span>{wood.name}</span>
                              <span className="text-sm font-semibold text-[#8C6D32]">
                                {formatRupee(wood.basePrice)}
                              </span>
                            </h3>
                            <p className="text-xs text-[#6F6A62] mt-1 line-clamp-2 leading-relaxed">
                              {wood.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E7E0D2]/70 flex items-center justify-between text-[11px] text-[#8C6D32] font-medium">
                          <span>Grain: {wood.grain || "Natural Timber"}</span>
                          <span className={isSelected ? "font-bold text-[#C9A669]" : "text-[#9E988E]"}>
                            {isSelected ? "Selected" : "Tap to Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                STEP 2: SELECT FRAME DESIGN
            ========================================================== */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E7E0D2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1B19]">
                      Step 2: Choose Frame Profile &amp; Design
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F6A62]">
                      Select the finish profile for your {selectedWood?.name || "selected timber"}.
                    </p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 bg-[#F8F6F2] border border-[#E7E0D2] rounded-full text-[#8C6D32] self-start sm:self-auto">
                    Wood: {selectedWood?.name} ({formatRupee(selectedWood?.basePrice)})
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {activeDesigns.map((design) => {
                    const isSelected = selectedDesign?.id === design.id;
                    const compatible = isDesignCompatible(design, selectedWood);

                    return (
                      <div
                        key={design.id}
                        onClick={() => {
                          if (compatible) setSelectedDesign(design);
                        }}
                        className={`group rounded-2xl overflow-hidden border transition-all p-4 flex flex-col justify-between relative ${
                          !compatible
                            ? "opacity-45 bg-[#F5F2EC] border-[#DCD3C0] cursor-not-allowed"
                            : isSelected
                            ? "border-[#C9A669] ring-2 ring-[#C9A669]/20 bg-[#FDFBF7] shadow-md cursor-pointer"
                            : "border-[#E7E0D2] hover:border-[#C9A669]/60 hover:bg-[#FAF8F5] cursor-pointer"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative h-40 rounded-xl overflow-hidden bg-[#ECE7DC] border border-[#E7E0D2]">
                            <img
                              src={design.image}
                              alt={design.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C9A669] text-[#1C1B19] flex items-center justify-center shadow">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-[#1C1B19]/80 backdrop-blur-sm text-[#F8F6F2] text-[11px] font-semibold">
                              {design.additionalPrice > 0
                                ? `+${formatRupee(design.additionalPrice)}`
                                : "Included (+₹0)"}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-display font-bold text-base text-[#1C1B19] flex items-center justify-between">
                              <span>{design.name}</span>
                              <span className="text-xs font-semibold text-[#8C6D32]">
                                {design.additionalPrice > 0
                                  ? `+${formatRupee(design.additionalPrice)}`
                                  : "₹0"}
                              </span>
                            </h3>
                            <p className="text-xs text-[#6F6A62] mt-1 line-clamp-2 leading-relaxed">
                              {design.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E7E0D2]/70 text-[11px]">
                          {!compatible ? (
                            <span className="text-red-700 font-semibold">
                              Incompatible with {selectedWood?.name}
                            </span>
                          ) : (
                            <span className={isSelected ? "font-bold text-[#C9A669]" : "text-[#8C6D32]"}>
                              {isSelected ? "Selected Profile" : "Tap to Select"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                STEP 3: UPLOAD PHOTO & PROTECTION PREVIEW
            ========================================================== */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E7E0D2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1B19]">
                      Step 3: Upload Photo &amp; Protected Preview
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F6A62]">
                      Upload the portrait you want framed. Preview is client-side protected against direct saving.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F0EBE0] text-[#7A5B20] text-xs font-semibold rounded-full border border-[#DCD3C0] self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A669]" />
                    <span>Client-Side Deterrence Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Upload Dropzone */}
                  <div className="lg:col-span-5 space-y-4">
                    <input
                      id={fileInputId}
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#C9A669]/70 hover:border-[#9C7B3D] bg-[#FDFBF7] hover:bg-[#FAF6EE] rounded-3xl p-8 text-center cursor-pointer transition-all space-y-3 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#EFE9DD] group-hover:bg-[#E5DEC7] text-[#9C7B3D] mx-auto flex items-center justify-center transition-colors shadow-sm">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-bold text-base text-[#1C1B19]">
                          Click or Drag to Upload Photograph
                        </h3>
                        <p className="text-xs text-[#6F6A62]">
                          Supports JPEG, PNG, WebP up to 25MB (Auto compressed for preview)
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#1C1B19] text-[#F8F6F2] rounded-xl text-xs font-semibold hover:bg-[#322F2A] transition-colors"
                      >
                        Choose File
                      </button>
                    </div>

                    {photoError && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                        {photoError}
                      </div>
                    )}

                    {uploadedPhoto && (
                      <div className="p-4 bg-[#F8F6F2] rounded-2xl border border-[#E7E0D2] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <ImageIcon className="w-5 h-5 text-[#C9A669] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#1C1B19] truncate">
                              {photoFileName || "Uploaded Photograph"}
                            </div>
                            <div className="text-[10px] text-[#6F6A62]">Ready for framing</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-[#8C6D32] hover:underline shrink-0"
                        >
                          Replace
                        </button>
                      </div>
                    )}

                    {/* Protection Policy Notice */}
                    <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E7E0D2] space-y-2 text-xs text-[#6F6A62]">
                      <div className="flex items-center gap-2 font-semibold text-[#1C1B19]">
                        <Lock className="w-4 h-4 text-[#C9A669]" />
                        <span>Client-Side Protection Policy</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Direct saving, context menu right-clicks, and image dragging are disabled on the browser preview. High-resolution archival prints are produced only at studio fulfillment.
                      </p>
                    </div>
                  </div>

                  {/* Photo Preview with Watermark Overlay */}
                  <div className="lg:col-span-7 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md bg-[#1C1B19] p-4 sm:p-6 rounded-3xl shadow-xl border border-[#3A3833] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#E4D3A6] border-b border-[#2C2A26] pb-2">
                        <span className="font-semibold tracking-wider uppercase">Atelier Framing Preview</span>
                        <span className="text-[11px] text-[#A8A196]">
                          {selectedWood?.name} · {selectedDesign?.name}
                        </span>
                      </div>

                      {/* Mock Frame Visualizer */}
                      <div
                        className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#24221F] border-8 shadow-inner flex items-center justify-center select-none"
                        style={{
                          borderColor:
                            selectedDesign?.name === "Classic Gold"
                              ? "#C9A669"
                              : selectedDesign?.name === "Modern Black"
                              ? "#1A1A1A"
                              : selectedDesign?.name === "Minimal White"
                              ? "#FAFAFA"
                              : "#6E472A",
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {uploadedPhoto ? (
                          <div className="relative w-full h-full select-none">
                            <img
                              src={uploadedPhoto}
                              alt="Client framed portrait"
                              className="w-full h-full object-cover select-none pointer-events-none"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                            {/* Watermark Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bg-black/15">
                              <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 text-white/80 text-xs tracking-widest uppercase font-bold text-center rotate-[-12deg] shadow-lg">
                                SUBASH STUDIO · WATERMARKED PREVIEW
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 text-[#A8A196] space-y-2">
                            <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-[#C9A669]" />
                            <div className="text-xs font-semibold text-[#F8F6F2]">
                              No Photograph Selected Yet
                            </div>
                            <div className="text-[11px]">
                              Upload a photo using the panel on the left to see your custom frame preview.
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-center text-[#8E867B] italic">
                        Right-click and dragging disabled on preview canvas.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                STEP 4: SELECT RATIO & SIZE
            ========================================================== */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E7E0D2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1B19]">
                      Step 4: Select Frame Aspect Ratio &amp; Dimensions
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F6A62]">
                      Choose standard proportions suited for tabletops, mantlepieces, or statement gallery walls.
                    </p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 bg-[#F8F6F2] border border-[#E7E0D2] rounded-full text-[#8C6D32] self-start sm:self-auto">
                    Centralized Size Pricing
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeRatios.map((ratio) => {
                    const isSelected = selectedRatio?.id === ratio.id;

                    return (
                      <div
                        key={ratio.id}
                        onClick={() => setSelectedRatio(ratio)}
                        className={`group cursor-pointer rounded-2xl border transition-all p-5 flex flex-col justify-between relative ${
                          isSelected
                            ? "border-[#C9A669] ring-2 ring-[#C9A669]/20 bg-[#FDFBF7] shadow-md"
                            : "border-[#E7E0D2] hover:border-[#C9A669]/60 hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-display font-bold text-lg text-[#1C1B19]">
                                  {ratio.name}
                                </h3>
                                {ratio.popular && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#C9A669]/20 text-[#8C6D32] text-[10px] font-bold">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#6F6A62] mt-0.5">{ratio.label}</div>
                            </div>
                            <div className="text-base font-bold text-[#8C6D32]">
                              {formatRupee(ratio.price)}
                            </div>
                          </div>

                          {/* Aspect Ratio Box Graphic */}
                          <div className="h-32 rounded-xl bg-[#F4EFE6] border border-[#E7E0D2] flex items-center justify-center p-3">
                            <div
                              className="border-2 border-[#8C6D32] bg-white shadow-sm flex items-center justify-center text-[11px] font-bold text-[#2B2B2B]"
                              style={{
                                width: ratio.name === "4 × 6" ? "70px" : ratio.name === "5 × 7" ? "80px" : ratio.name === "8 × 10" ? "90px" : ratio.name === "10 × 12" ? "100px" : "115px",
                                height: ratio.name === "4 × 6" ? "105px" : ratio.name === "5 × 7" ? "112px" : ratio.name === "8 × 10" ? "112px" : ratio.name === "10 × 12" ? "118px" : "125px",
                              }}
                            >
                              {ratio.name}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E7E0D2]/70 flex items-center justify-between text-xs">
                          <span className="text-[#6F6A62] text-[11px]">{ratio.dimensions}</span>
                          <span className={isSelected ? "font-bold text-[#C9A669]" : "text-[#9E988E]"}>
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                STEP 5: ORDER REVIEW & ITEMIZED PRICING BREAKDOWN
            ========================================================== */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E7E0D2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1B19]">
                      Step 5: Review Configuration &amp; Pricing Breakdown
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F6A62]">
                      Transparent calculation: Wood Base Price + Design Additional Price + Ratio/Size Price.
                    </p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 bg-[#C9A669]/15 border border-[#C9A669]/40 rounded-full text-[#8C6D32] self-start sm:self-auto">
                    Total: {pricing.formattedTotal}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Summary Cards */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E7E0D2] space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1B19]">
                        Selected Specifications
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D2]">
                          <span className="text-[10px] uppercase font-bold text-[#8C6D32]">Timber Wood</span>
                          <div className="font-bold text-sm text-[#1C1B19] mt-0.5">{selectedWood?.name}</div>
                          <div className="text-xs text-[#6F6A62] mt-0.5">{formatRupee(selectedWood?.basePrice)}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D2]">
                          <span className="text-[10px] uppercase font-bold text-[#8C6D32]">Frame Design</span>
                          <div className="font-bold text-sm text-[#1C1B19] mt-0.5">{selectedDesign?.name}</div>
                          <div className="text-xs text-[#6F6A62] mt-0.5">
                            {selectedDesign?.additionalPrice > 0 ? `+${formatRupee(selectedDesign.additionalPrice)}` : "₹0 (Included)"}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D2]">
                          <span className="text-[10px] uppercase font-bold text-[#8C6D32]">Size &amp; Ratio</span>
                          <div className="font-bold text-sm text-[#1C1B19] mt-0.5">{selectedRatio?.name}</div>
                          <div className="text-xs text-[#6F6A62] mt-0.5">{formatRupee(selectedRatio?.price)}</div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D2] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <ImageIcon className="w-5 h-5 text-[#C9A669] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#1C1B19] truncate">
                              {photoFileName || "Uploaded portrait for printing"}
                            </div>
                            <div className="text-[11px] text-[#6F6A62]">
                              Client-side verified &amp; ready for print lab
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-xs font-semibold text-[#8C6D32] hover:underline shrink-0"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>

                    {/* Pricing Breakdown Card */}
                    <div className="bg-white rounded-2xl p-5 border-2 border-[#E7E0D2] shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E7E0D2] pb-3">
                        <span className="font-display font-bold text-base text-[#1C1B19]">
                          Pricing Breakdown
                        </span>
                        <span className="text-xs text-[#6F6A62]">INR (₹)</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-[#2B2B2B]">
                          <span>Wood Base Price ({selectedWood?.name})</span>
                          <span className="font-semibold">{pricing.formattedWoodPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#2B2B2B]">
                          <span>Design Additional Charge ({selectedDesign?.name})</span>
                          <span className="font-semibold">{pricing.formattedDesignPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#2B2B2B]">
                          <span>Ratio / Size Price ({selectedRatio?.name})</span>
                          <span className="font-semibold">{pricing.formattedRatioPrice}</span>
                        </div>
                        <div className="pt-3 border-t border-[#E7E0D2] flex items-center justify-between text-base sm:text-lg font-bold text-[#1C1B19]">
                          <span className="flex items-center gap-2">
                            <span>Final Total Amount</span>
                            <span className="text-xs font-normal text-[#6F6A62]">(Inclusive of taxes)</span>
                          </span>
                          <span className="text-xl font-display text-[#8C6D32]">
                            {pricing.formattedTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Mini Photo Preview */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-sm bg-[#1C1B19] p-4 rounded-2xl shadow border border-[#3A3833] space-y-2 select-none">
                      <div className="text-[11px] font-bold text-[#E4D3A6] uppercase tracking-wider text-center">
                        Artisan Framing Preview
                      </div>
                      <div
                        className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#24221F] border-4 select-none"
                        style={{
                          borderColor:
                            selectedDesign?.name === "Classic Gold"
                              ? "#C9A669"
                              : selectedDesign?.name === "Modern Black"
                              ? "#1A1A1A"
                              : selectedDesign?.name === "Minimal White"
                              ? "#FAFAFA"
                              : "#6E472A",
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {uploadedPhoto && (
                          <img
                            src={uploadedPhoto}
                            alt="Preview"
                            className="w-full h-full object-cover select-none pointer-events-none"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                          <span className="px-3 py-1 rounded bg-black/50 text-white/80 text-[10px] tracking-wider uppercase font-bold rotate-[-12deg]">
                            SUBASH STUDIO
                          </span>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-[#A8A196]">
                        {selectedWood?.name} · {selectedDesign?.name} · {selectedRatio?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                STEP 6: CUSTOMER DETAILS FORM
            ========================================================== */}
            {currentStep === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E7E0D2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1B19]">
                      Step 6: Customer Details &amp; Fulfillment
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F6A62]">
                      Provide your contact details and choose between studio branch pickup or direct doorstep delivery.
                    </p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1 bg-[#F8F6F2] border border-[#E7E0D2] rounded-full text-[#8C6D32] self-start sm:self-auto">
                    Order Total: {pricing.formattedTotal}
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kavitha Ramachandran"
                        value={customerForm.name}
                        onChange={(e) => {
                          setCustomerForm((prev) => ({ ...prev, name: e.target.value }));
                          if (formErrors.name) setFormErrors((err) => ({ ...err, name: "" }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669] ${
                          formErrors.name ? "border-red-400 bg-red-50/40" : "border-[#E7E0D2]"
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-600">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98401 23456"
                        value={customerForm.phone}
                        onChange={(e) => {
                          setCustomerForm((prev) => ({ ...prev, phone: e.target.value }));
                          if (formErrors.phone) setFormErrors((err) => ({ ...err, phone: "" }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669] ${
                          formErrors.phone ? "border-red-400 bg-red-50/40" : "border-[#E7E0D2]"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-600">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. kavitha@example.com"
                        value={customerForm.email}
                        onChange={(e) => {
                          setCustomerForm((prev) => ({ ...prev, email: e.target.value }));
                          if (formErrors.email) setFormErrors((err) => ({ ...err, email: "" }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669] ${
                          formErrors.email ? "border-red-400 bg-red-50/40" : "border-[#E7E0D2]"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="Leave blank to use phone number"
                        value={customerForm.whatsapp}
                        onChange={(e) => setCustomerForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E0D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669]"
                      />
                    </div>
                  </div>

                  {/* Delivery Preference */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                      Delivery / Collection Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setCustomerForm((prev) => ({ ...prev, deliveryType: "Home Delivery" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          customerForm.deliveryType === "Home Delivery"
                            ? "border-[#C9A669] bg-[#FDFBF7] ring-1 ring-[#C9A669]"
                            : "border-[#E7E0D2] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <MapPin className="w-5 h-5 text-[#8C6D32] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-sm text-[#1C1B19]">Home Doorstep Delivery</div>
                          <div className="text-xs text-[#6F6A62] mt-0.5">
                            Shipped securely with protective cushion packaging
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setCustomerForm((prev) => ({ ...prev, deliveryType: "Studio Pickup" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          customerForm.deliveryType === "Studio Pickup"
                            ? "border-[#C9A669] bg-[#FDFBF7] ring-1 ring-[#C9A669]"
                            : "border-[#E7E0D2] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#8C6D32] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-sm text-[#1C1B19]">Studio Atelier Pickup</div>
                          <div className="text-xs text-[#6F6A62] mt-0.5">
                            Collect personally from Tirunelveli or Kalladaikurichi branch
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address or Branch Selection */}
                  {customerForm.deliveryType === "Home Delivery" ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                        Complete Shipping Address <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="House / Flat No, Street, Landmark, City & Pincode"
                        value={customerForm.address}
                        onChange={(e) => {
                          setCustomerForm((prev) => ({ ...prev, address: e.target.value }));
                          if (formErrors.address) setFormErrors((err) => ({ ...err, address: "" }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669] ${
                          formErrors.address ? "border-red-400 bg-red-50/40" : "border-[#E7E0D2]"
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-xs text-red-600">{formErrors.address}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                        Select Pickup Studio Branch
                      </label>
                      <select
                        value={customerForm.branchPickup}
                        onChange={(e) => setCustomerForm((prev) => ({ ...prev, branchPickup: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E0D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669] bg-white"
                      >
                        <option value="Tirunelveli Branch">Tirunelveli Atelier (Near Junction)</option>
                        <option value="Kalladaikurichi Branch">Kalladaikurichi Heritage Studio (Main Road)</option>
                      </select>
                    </div>
                  )}

                  {/* Special Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">
                      Special Instructions / Paper Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please use luster finish paper or crop closer to face"
                      value={customerForm.notes}
                      onChange={(e) => setCustomerForm((prev) => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E0D2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A669]"
                    />
                  </div>

                  {/* Final Submit Button inside step 6 */}
                  <div className="pt-4 border-t border-[#E7E0D2] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E7E0D2] text-xs font-bold uppercase tracking-wider text-[#2B2B2B] hover:bg-[#F8F6F2] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Review</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#C9A669] to-[#9C7B3D] text-[#1C1B19] rounded-xl text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Confirm &amp; Place Order ({pricing.formattedTotal})</span>
                          <Check className="w-4 h-4 stroke-[3]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ==========================================================
                STEP 7: SUCCESS SCREEN & RECEIPT PRINT
            ========================================================== */}
            {currentStep === 7 && placedOrder && (
              <motion.div
                key="step-7"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center max-w-lg mx-auto py-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EAE3D2] text-[#8C6D32] mx-auto flex items-center justify-center shadow-inner">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-wider uppercase text-[#1C1B19]">
                    ORDER SUCCESSFUL
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6F6A62]">
                    Your frame order has been successfully placed.
                  </p>
                </div>

                {/* Order ID Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D2] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D32]">
                    Order ID
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold text-[#1C1B19]">
                    {placedOrder.id}
                  </div>
                </div>

                {/* Compact Order Details Box */}
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E7E0D2] text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#E7E0D2]/60">
                    <span className="text-[#6F6A62] font-medium">Wood:</span>
                    <span className="font-bold text-[#1C1B19]">{placedOrder.woodType}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#E7E0D2]/60">
                    <span className="text-[#6F6A62] font-medium">Design:</span>
                    <span className="font-bold text-[#1C1B19]">{placedOrder.frameDesign}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#E7E0D2]/60">
                    <span className="text-[#6F6A62] font-medium">Ratio:</span>
                    <span className="font-bold text-[#1C1B19]">{placedOrder.frameRatio}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold text-sm">
                    <span className="text-[#1C1B19] uppercase tracking-wider">Total:</span>
                    <span className="text-base text-[#8C6D32]">
                      {formatRupee(placedOrder.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Primary Actions: Print Receipt & Back to Home */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-3.5 px-6 bg-[#1C1B19] text-[#F8F6F2] hover:bg-[#322F2A] rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-[#C9A669]" />
                    <span>Print Receipt</span>
                  </button>

                  <div className="flex items-center justify-center gap-4 text-xs pt-1">
                    <Link
                      to="/"
                      className="py-2.5 px-4 font-bold tracking-wider uppercase text-[#6F6A62] hover:text-[#1C1B19] transition-colors"
                    >
                      Back to Home
                    </Link>
                    <span className="text-[#DCD3C0]">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPlacedOrder(null);
                        setUploadedPhoto(null);
                        setPhotoFileName("");
                        setCurrentStep(1);
                      }}
                      className="py-2.5 px-4 font-bold tracking-wider uppercase text-[#8C6D32] hover:text-[#C9A669] transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Order Another Frame</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Navigation Buttons (Steps 1 to 5) */}
          {currentStep >= 1 && currentStep <= 5 && (
            <div className="mt-8 pt-6 border-t border-[#E7E0D2] flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-[#E7E0D2] text-xs font-bold uppercase tracking-wider text-[#2B2B2B] hover:bg-[#F8F6F2] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!canGoNext()}
                onClick={handleNext}
                className="px-7 py-2.5 bg-[#1C1B19] text-[#F8F6F2] rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#322F2A] transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow"
              >
                <span>
                  {currentStep === 5 ? "Proceed to Customer Details" : "Continue"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Standalone print-only receipt */}
    <FramePrintReceipt order={placedOrder} />
  </>
  );
}
