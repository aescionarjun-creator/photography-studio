import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check, ExternalLink, Navigation } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { services as defaultServices } from "../data/services";
import { useAdminData } from "../admin/context/AdminDataContext";

const STUDIO_LOCATIONS = [
  {
    id: "tirunelveli",
    name: "Tirunelveli Studio & Gallery",
    city: "Tirunelveli",
    tag: "Studio & Gallery",
    address: "Ahil Complex, S Bypass Rd, next to selam RR briyani, Vasanth Nagar, Tirunelveli, Tamil Nadu 627005",
    embedUrl: "https://maps.google.com/maps?q=8.7023167,77.7226628&hl=en&z=16&output=embed",
    mapsUrl: "https://maps.app.goo.gl/hh7A1jwk1hhb8svr9",
  },
  {
    id: "kalladaikurichi",
    name: "Kalladaikurichi Flagship Studio",
    city: "Kalladaikurichi",
    tag: "Flagship Studio & Atelier",
    address: "88 Main Road, Kalladaikurichi, Tamil Nadu 627416",
    embedUrl: "https://www.google.com/maps?q=subashstudio,Kalladaikurichi,TamilNadu&output=embed",
    mapsUrl: "https://maps.google.com/?q=Subash+Studio+Kalladaikurichi",
  },
];

export default function Contact() {
  const { addEnquiry, services: adminServices } = useAdminData();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("tirunelveli");

  const servicesList = adminServices && adminServices.length > 0 ? adminServices : defaultServices;
  const currentBranch = STUDIO_LOCATIONS.find((loc) => loc.id === selectedBranchId) || STUDIO_LOCATIONS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const enquiryData = {
      name: formData.get("name") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      service: formData.get("service") || "General Inquiry",
      eventDate: formData.get("date") || "",
      notes: formData.get("notes") || "",
    };

    if (addEnquiry) {
      addEnquiry(enquiryData);
    }

    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 600);
  };

  return (
    <>
      <Seo title="Contact" description="Book a shoot with SUBASH STUDIO — reach out to our Tirunelveli or Kalladaikurichi studio." />

      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Let's talk about your story."
          desc="Share a few details and our team will reply within 24 hours with availability and a quote."
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-28 grid grid-cols-1 lg:grid-cols-5 gap-14">
        <Reveal className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-card border border-line/60 rounded-md p-8 md:p-10 shadow-card">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-16"
              >
                <span className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mb-5">
                  <Check className="text-gold-dark" size={26} />
                </span>
                <h3 className="font-display text-2xl text-ink mb-2">Message sent</h3>
                <p className="text-sm text-ink-soft max-w-sm">
                  Thank you — a member of the SUBASH STUDIO team will reach out shortly to confirm your date.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" name="name" placeholder="Meera Krishnan" required />
                <Field label="Phone Number" name="phone" placeholder="+91 98765 43210" required />
                <Field label="Email" name="email" type="email" placeholder="you@example.com" required className="md:col-span-2" />
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-[0.08em] uppercase text-ink-soft font-semibold">Service</label>
                  <select name="service" className="bg-bg-soft border border-line rounded-sm px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold transition-colors" defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {servicesList.map((s) => <option key={s.slug || s.id || s.name} value={s.name || s.slug}>{s.name || s.title}</option>)}
                  </select>
                </div>
                <Field label="Event Date" name="date" type="date" />
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs tracking-[0.08em] uppercase text-ink-soft font-semibold">Tell us about your day</label>
                  <textarea
                    name="notes"
                    rows={5}
                    placeholder="Venue, guest count, style you love..."
                    className="bg-bg-soft border border-line rounded-sm px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="md:col-span-2 inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-bg-soft text-[13px] font-semibold tracking-[0.12em] uppercase rounded-full hover:bg-gold-dark transition-colors duration-300 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Enquiry"}
                  {!submitting && <Send size={15} />}
                </button>
              </div>
            )}
          </form>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-ink text-bg-soft rounded-md p-8 md:p-10">
            <p className="eyebrow text-gold-light mb-6">Reach Us Directly</p>
            <div className="space-y-4 text-sm">
              <a href="tel:+919345706609" className="flex items-center gap-3.5 hover:text-gold transition-colors">
                <Phone size={17} className="text-gold shrink-0" /> +91 93457 06609
              </a>
              <a href="mailto:hello@subashstudio.com" className="flex items-center gap-3.5 hover:text-gold transition-colors">
                <Mail size={17} className="text-gold shrink-0" /> hello@subashstudio.com
              </a>

              <div className="pt-3 border-t border-bg-soft/10 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gold-light/75 font-semibold">Our Studio Locations</p>
                {STUDIO_LOCATIONS.map((loc) => {
                  const isSelected = selectedBranchId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedBranchId(loc.id)}
                      className={`w-full text-left p-3 rounded transition-all border ${
                        isSelected
                          ? "bg-bg-soft/10 border-gold text-bg-soft shadow-xs ring-1 ring-gold/40"
                          : "bg-bg-soft/5 border-bg-soft/10 hover:border-bg-soft/30 text-bg-soft/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-xs tracking-wider uppercase text-gold">
                          {loc.city}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-gold/25 text-gold-light" : "bg-bg-soft/10 text-bg-soft/60"
                        }`}>
                          {isSelected ? "Active On Map" : "View On Map"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-bg-soft/80 leading-relaxed">
                        <MapPin size={13} className="text-gold shrink-0 mt-0.5" />
                        <span>{loc.address}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-bg-soft/10 mt-6">
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/+919345706609"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-full border border-bg-soft/25 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                >
                  <FaWhatsapp size={17} />
                </a>
                <a
                  href="https://www.instagram.com/subash_studio/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-bg-soft/25 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                >
                  <FaInstagram size={17} />
                </a>
              </div>

              <a
                href={currentBranch.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-gold hover:underline"
              >
                Directions <Navigation size={13} />
              </a>
            </div>
          </div>

          <div className="rounded-md overflow-hidden shadow-card border border-line/60 bg-card flex flex-col">
            <div className="p-3 bg-bg-soft border-b border-line flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-card p-1 rounded border border-line">
                {STUDIO_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setSelectedBranchId(loc.id)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      selectedBranchId === loc.id
                        ? "bg-ink text-bg-soft shadow-xs"
                        : "text-ink-soft hover:text-ink hover:bg-bg-soft"
                    }`}
                  >
                    {loc.city}
                  </button>
                ))}
              </div>

              <a
                href={currentBranch.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gold-dark hover:text-ink transition-colors px-2 py-1"
              >
                <span>Open in Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="relative h-72 w-full bg-line/10">
              <iframe
                key={currentBranch.id}
                title={`SUBASH STUDIO ${currentBranch.city} location`}
                src={currentBranch.embedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", placeholder, required, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs tracking-[0.08em] uppercase text-ink-soft font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="bg-bg-soft border border-line rounded-sm px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
