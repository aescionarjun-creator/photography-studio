import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch (err) {
    console.warn(`Storage load error for ${key}:`, err);
    return fallback;
  }
}

function loadObjectFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return fallback;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error("Storage save error for", key, err);
  }
}

// Safe normalizers that preserve existing IDs and ensure backward-compatibility
export function normalizeBooking(booking = {}) {
  if (!booking) return booking;
  return {
    ...booking,
    id: booking.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: booking.customerName || booking.clientName || "Valued Client",
    clientName: booking.clientName || booking.customerName || "Valued Client",
    phone: booking.phone || "",
    email: booking.email || "",
    eventType: booking.eventType || "Wedding",
    eventDate: booking.eventDate || booking.date || "",
    location: booking.location || booking.venue || "",
    numberOfDays: booking.numberOfDays || "1 Day",
    requiredService: booking.requiredService || booking.service || "Wedding Photography",
    photographyRequirement: booking.photographyRequirement || "",
    cinematographyRequirement: booking.cinematographyRequirement || "",
    budget: booking.budget || "",
    branch: booking.branch || "Tirunelveli",
    status: booking.status || "New",
    adminNotes: booking.adminNotes || booking.notes || "",
    createdAt: booking.createdAt || new Date().toISOString().split("T")[0],
  };
}

export function normalizeEnquiry(enquiry = {}) {
  if (!enquiry) return enquiry;
  const clientName = (enquiry.clientName || enquiry.name || "").trim();
  const phone = (enquiry.phone || "").trim();
  const email = (enquiry.email || "").trim();
  const service = enquiry.interestedService || enquiry.service || "General Inquiry";
  const eventDate = enquiry.proposedDate || enquiry.eventDate || enquiry.date || "";
  const location = enquiry.location || enquiry.venue || "";
  const message = (enquiry.message || enquiry.notes || enquiry.clientMessage || "").trim();
  const status = enquiry.status || "New";

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const createdAt = enquiry.createdAt || dateStr;
  const receivedDate = enquiry.receivedDate || `${createdAt} ${timeStr}`;

  return {
    ...enquiry,
    id: enquiry.id || `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
    name: clientName,
    clientName,
    phone,
    email,
    interestedService: service,
    service,
    eventDate,
    proposedDate: eventDate,
    location,
    venue: location,
    message,
    notes: message,
    clientMessage: message,
    status,
    createdAt,
    receivedDate,
  };
}

export function normalizeGalleryItem(item = {}) {
  if (!item) return item;
  const src = item.src || item.imageUrl || "";
  const imageUrl = item.imageUrl || item.src || "";
  const title = item.title || item.caption || "Subash Studio Gallery";
  const caption = item.caption || item.title || title;
  return {
    ...item,
    id: item.id || `GAL-${Math.floor(100 + Math.random() * 900)}`,
    src,
    imageUrl,
    title,
    caption,
    category: item.category || "Wedding",
    aspect: item.aspect || "landscape",
    published: item.published !== false,
    featured: Boolean(item.featured),
    createdAt: item.createdAt || new Date().toISOString().split("T")[0],
  };
}

export function normalizePortfolioItem(item = {}) {
  if (!item) return item;
  const coverImage = item.coverImage || item.image || item.imageUrl || "";
  const image = item.image || item.coverImage || item.imageUrl || "";
  const imageUrl = item.imageUrl || item.coverImage || item.image || "";
  const title = item.title || item.client || item.category || "Subash Studio Story";
  const subtitle = item.subtitle || item.client || "";
  const description = item.description || item.excerpt || "";
  const excerpt = item.excerpt || item.description || "";
  return {
    ...item,
    id: item.id || `PORT-${Math.floor(100 + Math.random() * 900)}`,
    title,
    subtitle,
    category: item.category || "Wedding",
    coverImage,
    image,
    imageUrl,
    eventDate: item.eventDate || "",
    location: item.location || "",
    description,
    excerpt,
    featured: item.featured ?? false,
    published: item.published !== false,
  };
}

export function normalizeService(srv = {}) {
  if (!srv) return srv;
  const name = srv.name || srv.title || "Subash Studio Service";
  const title = srv.title || srv.name || name;
  const slug = srv.slug || name.toLowerCase().replace(/\s+/g, "-");
  const image = srv.image || srv.imageUrl || "/images/services/wedding-photography.jpg";
  const imageUrl = srv.imageUrl || srv.image || image;
  const shortDesc = srv.shortDesc || srv.blurb || srv.description || "";
  const blurb = srv.blurb || srv.shortDesc || srv.description || "";
  const fullDesc = srv.fullDesc || srv.description || srv.shortDesc || "";
  const description = srv.description || srv.fullDesc || srv.shortDesc || "";
  return {
    ...srv,
    id: srv.id || `SRV-${Math.floor(100 + Math.random() * 900)}`,
    name,
    title,
    slug,
    image,
    imageUrl,
    shortDesc,
    blurb,
    fullDesc,
    description,
    startingPrice: srv.startingPrice || srv.price || "₹50,000",
    features: Array.isArray(srv.features) ? srv.features : [],
    status: srv.status || "Active",
  };
}

export function normalizeFilm(film = {}) {
  if (!film) return film;
  const title = film.title || "Subash Studio Film";
  const category = film.category || film.type || "Wedding Film";
  const type = film.type || film.category || "Wedding Film";
  const videoUrl = film.videoUrl || film.youtubeUrl || "";
  const youtubeUrl = film.youtubeUrl || film.videoUrl || "";
  const thumbnail = film.thumbnail || film.posterImage || film.poster || film.image || "";
  const posterImage = film.posterImage || film.thumbnail || film.poster || film.image || "";
  const poster = film.poster || film.thumbnail || film.posterImage || film.image || "";
  return {
    ...film,
    id: film.id || `FLM-${Math.floor(100 + Math.random() * 900)}`,
    title,
    category,
    type,
    videoUrl,
    youtubeUrl,
    duration: film.duration || "Highlight",
    thumbnail,
    posterImage,
    poster,
    description: film.description || "",
    featured: film.featured ?? false,
    published: film.published !== false,
  };
}

export function normalizeBranch(branch = {}) {
  if (!branch) return branch;
  const city = branch.city || branch.name || "Studio Branch";
  const name = branch.name || `${city} Studio`;
  return {
    ...branch,
    id: branch.id || `BR-${Math.floor(100 + Math.random() * 900)}`,
    name,
    city,
    tag: branch.tag || "Studio & Consultation Lounge",
    address: branch.address || "",
    phone: branch.phone || "+91 93457 06609",
    whatsapp: branch.whatsapp || branch.phone || "+91 93457 06609",
    email: branch.email || "subashstudio009@gmail.com",
    mapsUrl: branch.mapsUrl || "",
    hours: branch.hours || "Mon – Sun, 08:00 AM – 09:00 PM",
    image: branch.image || "/images/gallery/branches/kalladaikurichi.jpg",
    manager: branch.manager || "",
    active: branch.active !== false,
  };
}

export function normalizeTestimonial(tst = {}) {
  if (!tst) return tst;
  const customerName = tst.customerName || tst.clientName || tst.name || tst.googleReviewerName || "Valued Client";
  const name = tst.name || customerName;
  const customerRole = tst.customerRole || tst.eventType || tst.category || tst.service || "Client";
  const customerImage = tst.customerImage || tst.image || tst.avatar || "";
  const review = tst.review || tst.quote || tst.content || "";
  const rating = typeof tst.rating === "number" ? Math.max(1, Math.min(5, Math.round(tst.rating))) : 5;
  return {
    ...tst,
    id: tst.id || `TST-${Math.floor(100 + Math.random() * 900)}`,
    customerName,
    name,
    customerRole,
    customerImage,
    review,
    rating,
    source: tst.source || "manual",
    approved: tst.approved !== false,
    featured: Boolean(tst.featured),
    hidden: Boolean(tst.hidden),
    syncStatus: tst.syncStatus || (tst.source === "google" ? "imported" : "approved"),
    date: tst.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  };
}

export function AdminDataProvider({ children }) {
  // 1. Bookings
  const [bookings, setBookings] = useState(() => {
    const raw = loadFromStorage("bookings", initialBookings);
    return Array.isArray(raw) ? raw.map(normalizeBooking) : initialBookings.map(normalizeBooking);
  });
  useEffect(() => saveToStorage("bookings", bookings), [bookings]);

  const addBooking = useCallback((booking) => {
    const newBooking = normalizeBooking({
      ...booking,
      id: booking.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: booking.createdAt || new Date().toISOString().split("T")[0],
      status: booking.status || "New",
    });
    setBookings((prev) => {
      const next = [newBooking, ...prev];
      saveToStorage("bookings", next);
      return next;
    });
    return newBooking;
  }, []);

  const updateBooking = useCallback((id, updatedFields) => {
    setBookings((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeBooking({ ...item, ...updatedFields }) : item
      );
      saveToStorage("bookings", next);
      return next;
    });
  }, []);

  const deleteBooking = useCallback((id) => {
    setBookings((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("bookings", next);
      return next;
    });
  }, []);

  // 2. Enquiries
  const [enquiries, setEnquiries] = useState(() => {
    const raw = loadFromStorage("enquiries", initialEnquiries);
    return Array.isArray(raw) ? raw.map(normalizeEnquiry) : initialEnquiries.map(normalizeEnquiry);
  });
  useEffect(() => saveToStorage("enquiries", enquiries), [enquiries]);

  const addEnquiry = useCallback((enquiry) => {
    const newEnquiry = normalizeEnquiry(enquiry);
    setEnquiries((prev) => {
      const next = [newEnquiry, ...prev];
      saveToStorage("enquiries", next);
      return next;
    });
    return newEnquiry;
  }, []);

  const updateEnquiry = useCallback((id, updatedFields) => {
    setEnquiries((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeEnquiry({ ...item, ...updatedFields }) : item
      );
      saveToStorage("enquiries", next);
      return next;
    });
  }, []);

  const updateEnquiryStatus = useCallback((id, status) => {
    updateEnquiry(id, { status });
  }, [updateEnquiry]);

  const deleteEnquiry = useCallback((id) => {
    setEnquiries((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("enquiries", next);
      return next;
    });
  }, []);

  // 3. Gallery
  const [gallery, setGallery] = useState(() => {
    const raw = loadFromStorage("gallery", initialGallery);
    return Array.isArray(raw) ? raw.map(normalizeGalleryItem) : initialGallery.map(normalizeGalleryItem);
  });
  useEffect(() => saveToStorage("gallery", gallery), [gallery]);

  const addGalleryImage = useCallback((image) => {
    const newImage = normalizeGalleryItem({
      ...image,
      id: image.id || `GAL-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: image.createdAt || new Date().toISOString().split("T")[0],
      published: image.published !== false,
      featured: Boolean(image.featured),
    });
    setGallery((prev) => {
      const next = [newImage, ...prev];
      saveToStorage("gallery", next);
      return next;
    });
    return newImage;
  }, []);

  const updateGalleryImage = useCallback((id, updatedFields) => {
    setGallery((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeGalleryItem({ ...item, ...updatedFields }) : item
      );
      saveToStorage("gallery", next);
      return next;
    });
  }, []);

  const deleteGalleryImage = useCallback((id) => {
    setGallery((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("gallery", next);
      return next;
    });
  }, []);

  const toggleGalleryFeatured = useCallback((id) => {
    setGallery((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      );
      saveToStorage("gallery", next);
      return next;
    });
  }, []);

  const toggleGalleryPublished = useCallback((id) => {
    setGallery((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      );
      saveToStorage("gallery", next);
      return next;
    });
  }, []);

  // 4. Portfolio
  const [portfolio, setPortfolio] = useState(() => {
    const raw = loadFromStorage("portfolio", initialPortfolio);
    return Array.isArray(raw) ? raw.map(normalizePortfolioItem) : initialPortfolio.map(normalizePortfolioItem);
  });
  useEffect(() => saveToStorage("portfolio", portfolio), [portfolio]);

  const addPortfolio = useCallback((item) => {
    const newItem = normalizePortfolioItem({
      ...item,
      id: item.id || `PORT-${Math.floor(100 + Math.random() * 900)}`,
      featured: Boolean(item.featured),
      published: item.published !== false,
    });
    setPortfolio((prev) => {
      const next = [newItem, ...prev];
      saveToStorage("portfolio", next);
      return next;
    });
    return newItem;
  }, []);

  const updatePortfolio = useCallback((id, updatedFields) => {
    setPortfolio((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizePortfolioItem({ ...item, ...updatedFields }) : item
      );
      saveToStorage("portfolio", next);
      return next;
    });
  }, []);

  const deletePortfolio = useCallback((id) => {
    setPortfolio((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("portfolio", next);
      return next;
    });
  }, []);

  const togglePortfolioFeatured = useCallback((id) => {
    setPortfolio((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      );
      saveToStorage("portfolio", next);
      return next;
    });
  }, []);

  // 5. Services
  const [services, setServices] = useState(() => {
    const raw = loadFromStorage("services", initialServices);
    return Array.isArray(raw) ? raw.map(normalizeService) : initialServices.map(normalizeService);
  });
  useEffect(() => saveToStorage("services", services), [services]);

  const addService = useCallback((srv) => {
    const newSrv = normalizeService({
      ...srv,
      id: srv.id || `SRV-${Math.floor(100 + Math.random() * 900)}`,
      slug: srv.slug || (srv.name || "").toLowerCase().replace(/\s+/g, "-"),
      status: srv.status || "Active",
      features: Array.isArray(srv.features) ? srv.features : [],
    });
    setServices((prev) => {
      const next = [newSrv, ...prev];
      saveToStorage("services", next);
      return next;
    });
    return newSrv;
  }, []);

  const updateService = useCallback((id, updatedFields) => {
    setServices((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeService({ ...item, ...updatedFields }) : item
      );
      saveToStorage("services", next);
      return next;
    });
  }, []);

  const deleteService = useCallback((id) => {
    setServices((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("services", next);
      return next;
    });
  }, []);

  const toggleServiceStatus = useCallback((id) => {
    setServices((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      );
      saveToStorage("services", next);
      return next;
    });
  }, []);

  // 6. Films
  const [films, setFilms] = useState(() => {
    const raw = loadFromStorage("films", initialFilms);
    return Array.isArray(raw) ? raw.map(normalizeFilm) : initialFilms.map(normalizeFilm);
  });
  useEffect(() => saveToStorage("films", films), [films]);

  const addFilm = useCallback((film) => {
    const newFilm = normalizeFilm({
      ...film,
      id: film.id || `FLM-${Math.floor(100 + Math.random() * 900)}`,
      featured: Boolean(film.featured),
      published: film.published !== false,
    });
    setFilms((prev) => {
      const next = [newFilm, ...prev];
      saveToStorage("films", next);
      return next;
    });
    return newFilm;
  }, []);

  const updateFilm = useCallback((id, updatedFields) => {
    setFilms((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeFilm({ ...item, ...updatedFields }) : item
      );
      saveToStorage("films", next);
      return next;
    });
  }, []);

  const deleteFilm = useCallback((id) => {
    setFilms((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("films", next);
      return next;
    });
  }, []);

  const toggleFilmFeatured = useCallback((id) => {
    setFilms((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      );
      saveToStorage("films", next);
      return next;
    });
  }, []);

  const toggleFilmPublished = useCallback((id) => {
    setFilms((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      );
      saveToStorage("films", next);
      return next;
    });
  }, []);

  // 7. Branches
  const [branches, setBranches] = useState(() => {
    const raw = loadFromStorage("branches", initialBranches);
    return Array.isArray(raw) ? raw.map(normalizeBranch) : initialBranches.map(normalizeBranch);
  });
  useEffect(() => saveToStorage("branches", branches), [branches]);

  const addBranch = useCallback((branch) => {
    const newBranch = normalizeBranch({
      ...branch,
      id: branch.id || `BR-${Math.floor(100 + Math.random() * 900)}`,
      active: branch.active !== false,
    });
    setBranches((prev) => {
      const next = [newBranch, ...prev];
      saveToStorage("branches", next);
      return next;
    });
    return newBranch;
  }, []);

  const updateBranch = useCallback((id, updatedFields) => {
    setBranches((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeBranch({ ...item, ...updatedFields }) : item
      );
      saveToStorage("branches", next);
      return next;
    });
  }, []);

  const deleteBranch = useCallback((id) => {
    setBranches((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("branches", next);
      return next;
    });
  }, []);

  const toggleBranchStatus = useCallback((id) => {
    setBranches((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      );
      saveToStorage("branches", next);
      return next;
    });
  }, []);

  // 8. Testimonials
  const [testimonials, setTestimonials] = useState(() => {
    const raw = loadFromStorage("testimonials", initialTestimonials);
    return Array.isArray(raw)
      ? raw.map(normalizeTestimonial)
      : initialTestimonials.map(normalizeTestimonial);
  });
  useEffect(() => saveToStorage("testimonials", testimonials), [testimonials]);

  // Google Reviews sync metadata
  const [googleReviewsMeta, setGoogleReviewsMeta] = useState(() =>
    loadObjectFromStorage("googleReviewsMeta", {
      lastSynced: null,
      totalGoogleReviews: 0,
      accountName: "Subash Studio",
    })
  );
  useEffect(() => saveToStorage("googleReviewsMeta", googleReviewsMeta), [googleReviewsMeta]);

  const addTestimonial = useCallback((tst) => {
    const newTst = normalizeTestimonial({
      ...tst,
      id: tst.id || `TST-${Math.floor(100 + Math.random() * 900)}`,
      source: tst.source || "manual",
      approved: tst.approved !== false,
      featured: Boolean(tst.featured),
      hidden: Boolean(tst.hidden),
      syncStatus: tst.syncStatus || "approved",
      date: tst.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    });
    setTestimonials((prev) => {
      const next = [newTst, ...prev];
      saveToStorage("testimonials", next);
      return next;
    });
    return newTst;
  }, []);

  const updateTestimonial = useCallback((id, updatedFields) => {
    setTestimonials((prev) => {
      const next = prev.map((item) =>
        item.id === id ? normalizeTestimonial({ ...item, ...updatedFields }) : item
      );
      saveToStorage("testimonials", next);
      return next;
    });
  }, []);

  const deleteTestimonial = useCallback((id) => {
    setTestimonials((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("testimonials", next);
      return next;
    });
  }, []);

  const toggleTestimonialApproved = useCallback((id) => {
    setTestimonials((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, approved: !item.approved } : item
      );
      saveToStorage("testimonials", next);
      return next;
    });
  }, []);

  const toggleTestimonialFeatured = useCallback((id) => {
    setTestimonials((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      );
      saveToStorage("testimonials", next);
      return next;
    });
  }, []);

  const toggleTestimonialHidden = useCallback((id) => {
    setTestimonials((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, hidden: !item.hidden } : item
      );
      saveToStorage("testimonials", next);
      return next;
    });
  }, []);

  const syncGoogleReviews = useCallback((fetchedReviews = []) => {
    let newCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;

    setTestimonials((prev) => {
      const existingGoogleMap = new Map();
      prev.forEach((item) => {
        const key = item.googleReviewId || (item.source === "google" ? item.id : null);
        if (key) existingGoogleMap.set(key, item);
      });

      const updatedPrev = prev.map((item) => {
        const key = item.googleReviewId || (item.source === "google" ? item.id : null);
        if (!key) return item;

        const matchedFetch = fetchedReviews.find(
          (f) => f.googleReviewId === key || f.id === item.id
        );
        if (!matchedFetch) return item;

        const hasChanged =
          item.review !== matchedFetch.review ||
          item.rating !== matchedFetch.rating ||
          item.date !== matchedFetch.date ||
          item.googleReply !== matchedFetch.googleReply;

        if (hasChanged) {
          updatedCount++;
          return {
            ...item,
            review: matchedFetch.review,
            rating: matchedFetch.rating,
            date: matchedFetch.date,
            googleUpdateTime: matchedFetch.googleUpdateTime || item.googleUpdateTime,
            googleReply: matchedFetch.googleReply || item.googleReply,
            customerName: matchedFetch.customerName || item.customerName,
            customerImage: matchedFetch.customerImage || item.customerImage,
          };
        }

        unchangedCount++;
        return item;
      });

      const newItems = [];
      fetchedReviews.forEach((fetched) => {
        const key = fetched.googleReviewId || fetched.id;
        if (!existingGoogleMap.has(key)) {
          newCount++;
          newItems.push({
            ...fetched,
            source: "google",
            approved: false, // Default to false so admin moderates first
            featured: false,
            hidden: false,
            syncStatus: "imported",
          });
        }
      });

      const next = [...newItems, ...updatedPrev];
      saveToStorage("testimonials", next);
      return next;
    });

    setGoogleReviewsMeta((prev) => {
      const next = {
        ...prev,
        lastSynced: new Date().toISOString(),
        totalGoogleReviews: (prev.totalGoogleReviews || 0) + newCount,
      };
      saveToStorage("googleReviewsMeta", next);
      return next;
    });

    return {
      checked: fetchedReviews.length,
      added: newCount,
      updated: updatedCount,
      unchanged: unchangedCount,
    };
  }, []);

  // 9. Website Content
  const [websiteContent, setWebsiteContent] = useState(() =>
    loadObjectFromStorage("websiteContent", initialWebsiteContent)
  );
  useEffect(() => saveToStorage("websiteContent", websiteContent), [websiteContent]);

  const updateWebsiteContent = useCallback((section, updatedFields) => {
    setWebsiteContent((prev) => {
      const next = {
        ...prev,
        [section]: { ...prev[section], ...updatedFields },
      };
      saveToStorage("websiteContent", next);
      return next;
    });
  }, []);

  // 10. Settings
  const [settings, setSettings] = useState(() =>
    loadObjectFromStorage("settings", initialSettings)
  );
  useEffect(() => saveToStorage("settings", settings), [settings]);

  const updateSettings = useCallback((section, updatedFields) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        [section]: { ...prev[section], ...updatedFields },
      };
      saveToStorage("settings", next);
      return next;
    });
  }, []);

  // 11. Frame Wood Types
  const [frameWoodTypes, setFrameWoodTypes] = useState(() =>
    loadFromStorage("frameWoodTypes", initialFrameWoodTypes)
  );
  useEffect(() => saveToStorage("frameWoodTypes", frameWoodTypes), [frameWoodTypes]);

  const addFrameWoodType = useCallback((wood) => {
    const newWood = {
      ...wood,
      id: wood.id || `wood-${Date.now()}`,
      active: wood.active !== false,
    };
    setFrameWoodTypes((prev) => {
      const next = [...prev, newWood];
      saveToStorage("frameWoodTypes", next);
      return next;
    });
    return newWood;
  }, []);

  const updateFrameWoodType = useCallback((id, updatedFields) => {
    setFrameWoodTypes((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage("frameWoodTypes", next);
      return next;
    });
  }, []);

  const deleteFrameWoodType = useCallback((id) => {
    setFrameWoodTypes((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("frameWoodTypes", next);
      return next;
    });
  }, []);

  const toggleFrameWoodTypeStatus = useCallback((id) => {
    setFrameWoodTypes((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      );
      saveToStorage("frameWoodTypes", next);
      return next;
    });
  }, []);

  // 12. Frame Designs
  const [frameDesigns, setFrameDesigns] = useState(() =>
    loadFromStorage("frameDesigns", initialFrameDesigns)
  );
  useEffect(() => saveToStorage("frameDesigns", frameDesigns), [frameDesigns]);

  const addFrameDesign = useCallback((design) => {
    const newDesign = {
      ...design,
      id: design.id || `design-${Date.now()}`,
      compatibleWoods: design.compatibleWoods || ["All"],
      active: design.active !== false,
    };
    setFrameDesigns((prev) => {
      const next = [...prev, newDesign];
      saveToStorage("frameDesigns", next);
      return next;
    });
    return newDesign;
  }, []);

  const updateFrameDesign = useCallback((id, updatedFields) => {
    setFrameDesigns((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage("frameDesigns", next);
      return next;
    });
  }, []);

  const deleteFrameDesign = useCallback((id) => {
    setFrameDesigns((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("frameDesigns", next);
      return next;
    });
  }, []);

  const toggleFrameDesignStatus = useCallback((id) => {
    setFrameDesigns((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      );
      saveToStorage("frameDesigns", next);
      return next;
    });
  }, []);

  // 13. Frame Ratios
  const [frameRatios, setFrameRatios] = useState(() =>
    loadFromStorage("frameRatios", initialFrameRatios)
  );
  useEffect(() => saveToStorage("frameRatios", frameRatios), [frameRatios]);

  const addFrameRatio = useCallback((ratio) => {
    const newRatio = {
      ...ratio,
      id: ratio.id || `ratio-${Date.now()}`,
      active: ratio.active !== false,
    };
    setFrameRatios((prev) => {
      const next = [...prev, newRatio];
      saveToStorage("frameRatios", next);
      return next;
    });
    return newRatio;
  }, []);

  const updateFrameRatio = useCallback((id, updatedFields) => {
    setFrameRatios((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage("frameRatios", next);
      return next;
    });
  }, []);

  const deleteFrameRatio = useCallback((id) => {
    setFrameRatios((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("frameRatios", next);
      return next;
    });
  }, []);

  const toggleFrameRatioStatus = useCallback((id) => {
    setFrameRatios((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      );
      saveToStorage("frameRatios", next);
      return next;
    });
  }, []);

  // 14. Frame Orders
  const [frameOrders, setFrameOrders] = useState(() =>
    loadFromStorage("frameOrders", initialFrameOrders)
  );
  useEffect(() => saveToStorage("frameOrders", frameOrders), [frameOrders]);

  const addFrameOrder = useCallback((order) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(100 + Math.random() * 900);
    const newOrder = {
      ...order,
      id: order.id || `SS-FR-${today}-${rand}`,
      status: order.status || "New",
      createdAt: order.createdAt || new Date().toISOString(),
    };
    setFrameOrders((prev) => {
      const next = [newOrder, ...prev];
      saveToStorage("frameOrders", next);
      return next;
    });
    return newOrder;
  }, []);

  const updateFrameOrderStatus = useCallback((id, status) => {
    setFrameOrders((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, status } : item));
      saveToStorage("frameOrders", next);
      return next;
    });
  }, []);

  const updateFrameOrder = useCallback((id, updatedFields) => {
    setFrameOrders((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage("frameOrders", next);
      return next;
    });
  }, []);

  const deleteFrameOrder = useCallback((id) => {
    setFrameOrders((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage("frameOrders", next);
      return next;
    });
  }, []);

  // Synchronize across browser tabs automatically via window storage event
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key || !e.key.startsWith(STORAGE_PREFIX) || !e.newValue) return;
      const entityKey = e.key.slice(STORAGE_PREFIX.length);
      try {
        const parsed = JSON.parse(e.newValue);
        switch (entityKey) {
          case "bookings":
            if (Array.isArray(parsed)) setBookings(parsed.map(normalizeBooking));
            break;
          case "enquiries":
            if (Array.isArray(parsed)) setEnquiries(parsed.map(normalizeEnquiry));
            break;
          case "gallery":
            if (Array.isArray(parsed)) setGallery(parsed.map(normalizeGalleryItem));
            break;
          case "portfolio":
            if (Array.isArray(parsed)) setPortfolio(parsed.map(normalizePortfolioItem));
            break;
          case "services":
            if (Array.isArray(parsed)) setServices(parsed.map(normalizeService));
            break;
          case "films":
            if (Array.isArray(parsed)) setFilms(parsed.map(normalizeFilm));
            break;
          case "branches":
            if (Array.isArray(parsed)) setBranches(parsed.map(normalizeBranch));
            break;
          case "testimonials":
            if (Array.isArray(parsed)) setTestimonials(parsed.map(normalizeTestimonial));
            break;
          case "googleReviewsMeta":
            if (parsed && typeof parsed === "object") setGoogleReviewsMeta(parsed);
            break;
          case "websiteContent":
            if (parsed && typeof parsed === "object") {
              setWebsiteContent((prev) => ({ ...prev, ...parsed }));
            }
            break;
          case "settings":
            if (parsed && typeof parsed === "object") {
              setSettings((prev) => ({ ...prev, ...parsed }));
            }
            break;
          case "frameWoodTypes":
            if (Array.isArray(parsed)) setFrameWoodTypes(parsed);
            break;
          case "frameDesigns":
            if (Array.isArray(parsed)) setFrameDesigns(parsed);
            break;
          case "frameRatios":
            if (Array.isArray(parsed)) setFrameRatios(parsed);
            break;
          case "frameOrders":
            if (Array.isArray(parsed)) setFrameOrders(parsed);
            break;
          default:
            break;
        }
      } catch (err) {
        console.warn("Storage sync event error:", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const resetAllDemoData = useCallback(() => {
    setBookings(initialBookings.map(normalizeBooking));
    setEnquiries(initialEnquiries.map(normalizeEnquiry));
    setGallery(initialGallery.map(normalizeGalleryItem));
    setPortfolio(initialPortfolio.map(normalizePortfolioItem));
    setServices(initialServices.map(normalizeService));
    setFilms(initialFilms.map(normalizeFilm));
    setBranches(initialBranches.map(normalizeBranch));
    setTestimonials(initialTestimonials.map(normalizeTestimonial));
    setWebsiteContent(initialWebsiteContent);
    setSettings(initialSettings);
    setFrameWoodTypes(initialFrameWoodTypes);
    setFrameDesigns(initialFrameDesigns);
    setFrameRatios(initialFrameRatios);
    setFrameOrders(initialFrameOrders);

    saveToStorage("bookings", initialBookings.map(normalizeBooking));
    saveToStorage("enquiries", initialEnquiries.map(normalizeEnquiry));
    saveToStorage("gallery", initialGallery.map(normalizeGalleryItem));
    saveToStorage("portfolio", initialPortfolio.map(normalizePortfolioItem));
    saveToStorage("services", initialServices.map(normalizeService));
    saveToStorage("films", initialFilms.map(normalizeFilm));
    saveToStorage("branches", initialBranches.map(normalizeBranch));
    saveToStorage("testimonials", initialTestimonials.map(normalizeTestimonial));
    saveToStorage("websiteContent", initialWebsiteContent);
    saveToStorage("settings", initialSettings);
    saveToStorage("frameWoodTypes", initialFrameWoodTypes);
    saveToStorage("frameDesigns", initialFrameDesigns);
    saveToStorage("frameRatios", initialFrameRatios);
    saveToStorage("frameOrders", initialFrameOrders);
  }, []);

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
        updateEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,

        // Gallery
        gallery,
        addGalleryImage,
        addGalleryItem: addGalleryImage,
        updateGalleryImage,
        updateGalleryItem: updateGalleryImage,
        deleteGalleryImage,
        deleteGalleryItem: deleteGalleryImage,
        toggleGalleryFeatured,
        toggleGalleryPublished,

        // Portfolio
        portfolio,
        addPortfolio,
        addPortfolioItem: addPortfolio,
        updatePortfolio,
        updatePortfolioItem: updatePortfolio,
        deletePortfolio,
        deletePortfolioItem: deletePortfolio,
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
        toggleTestimonialHidden,
        syncGoogleReviews,
        googleReviewsMeta,
        setGoogleReviewsMeta,

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
