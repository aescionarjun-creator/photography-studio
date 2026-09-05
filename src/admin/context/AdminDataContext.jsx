import { createContext, useContext, useState, useEffect } from "react";
import {
  initialBookings,
  initialEnquiries,
  initialGallery,
  initialPortfolio,
  initialServices,
  initialFilms,
  initialBranches,
  initialTestimonials,
  initialWebsiteContent,
  initialSettings,
  initialFrameWoodTypes,
  initialFrameDesigns,
  initialFrameRatios,
  initialFrameOrders,
} from "../data/adminInitialData";

const AdminDataContext = createContext(null);

const STORAGE_PREFIX = "subash_studio_db_v4_";

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    // If stored array has stale dummy image paths, use updated fallback
    if (Array.isArray(parsed) && parsed.length > 0) {
      const hasStale = parsed.some((p) => (p.imageUrl || p.coverImage || p.image || "").includes("gal-1.jpg"));
      if (hasStale) return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error("Storage error for", key, err);
  }
}

export function AdminDataProvider({ children }) {
  // 1. Bookings
  const [bookings, setBookings] = useState(() =>
    loadFromStorage("bookings", initialBookings)
  );
  useEffect(() => saveToStorage("bookings", bookings), [bookings]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: booking.status || "New",
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBooking = (id, updatedFields) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((item) => item.id !== id));
  };

  // 2. Enquiries
  const [enquiries, setEnquiries] = useState(() =>
    loadFromStorage("enquiries", initialEnquiries)
  );
  useEffect(() => saveToStorage("enquiries", enquiries), [enquiries]);

  const addEnquiry = (enquiry) => {
    const newEnquiry = {
      ...enquiry,
      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: enquiry.status || "New",
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return newEnquiry;
  };

  const updateEnquiryStatus = (id, status) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteEnquiry = (id) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
  };

  // 3. Gallery
  const [gallery, setGallery] = useState(() =>
    loadFromStorage("gallery", initialGallery)
  );
  useEffect(() => saveToStorage("gallery", gallery), [gallery]);

  const addGalleryImage = (image) => {
    const newImage = {
      ...image,
      id: `GAL-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split("T")[0],
      published: image.published ?? true,
      featured: image.featured ?? false,
    };
    setGallery((prev) => [newImage, ...prev]);
    return newImage;
  };

  const updateGalleryImage = (id, updatedFields) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteGalleryImage = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleGalleryFeatured = (id) => {
    setGallery((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const toggleGalleryPublished = (id) => {
    setGallery((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      )
    );
  };

  // 4. Portfolio
  const [portfolio, setPortfolio] = useState(() =>
    loadFromStorage("portfolio", initialPortfolio)
  );
  useEffect(() => saveToStorage("portfolio", portfolio), [portfolio]);

  const addPortfolio = (item) => {
    const newItem = {
      ...item,
      id: `PORT-${Math.floor(100 + Math.random() * 900)}`,
      featured: item.featured ?? false,
      published: item.published ?? true,
    };
    setPortfolio((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updatePortfolio = (id, updatedFields) => {
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deletePortfolio = (id) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePortfolioFeatured = (id) => {
    setPortfolio((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  // 5. Services
  const [services, setServices] = useState(() =>
    loadFromStorage("services", initialServices)
  );
  useEffect(() => saveToStorage("services", services), [services]);

  const addService = (srv) => {
    const newSrv = {
      ...srv,
      id: `SRV-${Math.floor(100 + Math.random() * 900)}`,
      slug: srv.slug || srv.name.toLowerCase().replace(/\s+/g, "-"),
      status: srv.status || "Active",
      features: srv.features || [],
    };
    setServices((prev) => [newSrv, ...prev]);
    return newSrv;
  };

  const updateService = (id, updatedFields) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleServiceStatus = (id) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
  };

  // 6. Films
  const [films, setFilms] = useState(() =>
    loadFromStorage("films", initialFilms)
  );
  useEffect(() => saveToStorage("films", films), [films]);

  const addFilm = (film) => {
    const newFilm = {
      ...film,
      id: `FLM-${Math.floor(100 + Math.random() * 900)}`,
      featured: film.featured ?? false,
      published: film.published ?? true,
    };
    setFilms((prev) => [newFilm, ...prev]);
    return newFilm;
  };

  const updateFilm = (id, updatedFields) => {
    setFilms((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFilm = (id) => {
    setFilms((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFilmFeatured = (id) => {
    setFilms((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const toggleFilmPublished = (id) => {
    setFilms((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      )
    );
  };

  // 7. Branches
  const [branches, setBranches] = useState(() =>
    loadFromStorage("branches", initialBranches)
  );
  useEffect(() => saveToStorage("branches", branches), [branches]);

  const addBranch = (branch) => {
    const newBranch = {
      ...branch,
      id: `BR-${Math.floor(100 + Math.random() * 900)}`,
      active: branch.active ?? true,
    };
    setBranches((prev) => [newBranch, ...prev]);
    return newBranch;
  };

  const updateBranch = (id, updatedFields) => {
    setBranches((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteBranch = (id) => {
    setBranches((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleBranchStatus = (id) => {
    setBranches((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  // 8. Testimonials
  const [testimonials, setTestimonials] = useState(() =>
    loadFromStorage("testimonials", initialTestimonials)
  );
  useEffect(() => saveToStorage("testimonials", testimonials), [testimonials]);

  const addTestimonial = (tst) => {
    const newTst = {
      ...tst,
      id: `TST-${Math.floor(100 + Math.random() * 900)}`,
      approved: tst.approved ?? true,
      featured: tst.featured ?? false,
      date: tst.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    setTestimonials((prev) => [newTst, ...prev]);
    return newTst;
  };

  const updateTestimonial = (id, updatedFields) => {
    setTestimonials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteTestimonial = (id) => {
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleTestimonialApproved = (id) => {
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !item.approved } : item
      )
    );
  };

  const toggleTestimonialFeatured = (id) => {
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  // 9. Website Content
  const [websiteContent, setWebsiteContent] = useState(() =>
    loadFromStorage("websiteContent", initialWebsiteContent)
  );
  useEffect(
    () => saveToStorage("websiteContent", websiteContent),
    [websiteContent]
  );

  const updateWebsiteContent = (section, updatedFields) => {
    setWebsiteContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updatedFields },
    }));
  };

  // 10. Settings
  const [settings, setSettings] = useState(() =>
    loadFromStorage("settings", initialSettings)
  );
  useEffect(() => saveToStorage("settings", settings), [settings]);

  const updateSettings = (section, updatedFields) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updatedFields },
    }));
  };

  // 11. Frame Wood Types
  const [frameWoodTypes, setFrameWoodTypes] = useState(() =>
    loadFromStorage("frameWoodTypes", initialFrameWoodTypes)
  );
  useEffect(() => saveToStorage("frameWoodTypes", frameWoodTypes), [frameWoodTypes]);

  const addFrameWoodType = (wood) => {
    const newWood = {
      ...wood,
      id: wood.id || `wood-${Date.now()}`,
      active: wood.active ?? true,
    };
    setFrameWoodTypes((prev) => [...prev, newWood]);
    return newWood;
  };

  const updateFrameWoodType = (id, updatedFields) => {
    setFrameWoodTypes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFrameWoodType = (id) => {
    setFrameWoodTypes((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFrameWoodTypeStatus = (id) => {
    setFrameWoodTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  // 12. Frame Designs
  const [frameDesigns, setFrameDesigns] = useState(() =>
    loadFromStorage("frameDesigns", initialFrameDesigns)
  );
  useEffect(() => saveToStorage("frameDesigns", frameDesigns), [frameDesigns]);

  const addFrameDesign = (design) => {
    const newDesign = {
      ...design,
      id: design.id || `design-${Date.now()}`,
      compatibleWoods: design.compatibleWoods || ["All"],
      active: design.active ?? true,
    };
    setFrameDesigns((prev) => [...prev, newDesign]);
    return newDesign;
  };

  const updateFrameDesign = (id, updatedFields) => {
    setFrameDesigns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFrameDesign = (id) => {
    setFrameDesigns((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFrameDesignStatus = (id) => {
    setFrameDesigns((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  // 13. Frame Ratios
  const [frameRatios, setFrameRatios] = useState(() =>
    loadFromStorage("frameRatios", initialFrameRatios)
  );
  useEffect(() => saveToStorage("frameRatios", frameRatios), [frameRatios]);

  const addFrameRatio = (ratio) => {
    const newRatio = {
      ...ratio,
      id: ratio.id || `ratio-${Date.now()}`,
      active: ratio.active ?? true,
    };
    setFrameRatios((prev) => [...prev, newRatio]);
    return newRatio;
  };

  const updateFrameRatio = (id, updatedFields) => {
    setFrameRatios((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFrameRatio = (id) => {
    setFrameRatios((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFrameRatioStatus = (id) => {
    setFrameRatios((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  // 14. Frame Orders
  const [frameOrders, setFrameOrders] = useState(() =>
    loadFromStorage("frameOrders", initialFrameOrders)
  );
  useEffect(() => saveToStorage("frameOrders", frameOrders), [frameOrders]);

  const addFrameOrder = (order) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(100 + Math.random() * 900);
    const newOrder = {
      ...order,
      id: order.id || `SS-FR-${today}-${rand}`,
      status: order.status || "New",
      createdAt: order.createdAt || new Date().toISOString(),
    };
    setFrameOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateFrameOrderStatus = (id, status) => {
    setFrameOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const updateFrameOrder = (id, updatedFields) => {
    setFrameOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFrameOrder = (id) => {
    setFrameOrders((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAllDemoData = () => {
    setBookings(initialBookings);
    setEnquiries(initialEnquiries);
    setGallery(initialGallery);
    setPortfolio(initialPortfolio);
    setServices(initialServices);
    setFilms(initialFilms);
    setBranches(initialBranches);
    setTestimonials(initialTestimonials);
    setWebsiteContent(initialWebsiteContent);
    setSettings(initialSettings);
    setFrameWoodTypes(initialFrameWoodTypes);
    setFrameDesigns(initialFrameDesigns);
    setFrameRatios(initialFrameRatios);
    setFrameOrders(initialFrameOrders);
  };

  return (
    <AdminDataContext.Provider
      value={{
        // Bookings
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,

        // Enquiries
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,

        // Gallery
        gallery,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        toggleGalleryFeatured,
        toggleGalleryPublished,

        // Portfolio
        portfolio,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        togglePortfolioFeatured,

        // Services
        services,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,

        // Films
        films,
        addFilm,
        updateFilm,
        deleteFilm,
        toggleFilmFeatured,
        toggleFilmPublished,

        // Branches
        branches,
        addBranch,
        updateBranch,
        deleteBranch,
        toggleBranchStatus,

        // Testimonials
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleTestimonialApproved,
        toggleTestimonialFeatured,

        // Website Content
        websiteContent,
        updateWebsiteContent,

        // Settings
        settings,
        updateSettings,

        // Frame Wood Types
        frameWoodTypes,
        addFrameWoodType,
        updateFrameWoodType,
        deleteFrameWoodType,
        toggleFrameWoodTypeStatus,

        // Frame Designs
        frameDesigns,
        addFrameDesign,
        updateFrameDesign,
        deleteFrameDesign,
        toggleFrameDesignStatus,

        // Frame Ratios
        frameRatios,
        addFrameRatio,
        updateFrameRatio,
        deleteFrameRatio,
        toggleFrameRatioStatus,

        // Frame Orders
        frameOrders,
        addFrameOrder,
        updateFrameOrderStatus,
        updateFrameOrder,
        deleteFrameOrder,

        resetAllDemoData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
