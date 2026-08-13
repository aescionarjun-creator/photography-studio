import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { services } from "../data/services";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Frontend-only demo: no backend is wired up yet.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  };

  return (
    <>
      <Seo title="Contact" description="Book a shoot with SUBASH STUDIO — reach out to our Chennai, Coimbatore or Madurai studio." />

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
                  <select className="bg-bg-soft border border-line rounded-sm px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold transition-colors" defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                  </select>
                </div>
                <Field label="Event Date" name="date" type="date" />
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs tracking-[0.08em] uppercase text-ink-soft font-semibold">Tell us about your day</label>
                  <textarea
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
            <div className="space-y-5 text-sm">
              <a href="tel:+919876543210" className="flex items-center gap-4 hover:text-gold transition-colors">
                <Phone size={18} className="text-gold shrink-0" /> +91 93457 06609
              </a>
              <a href="mailto:hello@subashstudio.com" className="flex items-center gap-4 hover:text-gold transition-colors">
                <Mail size={18} className="text-gold shrink-0" /> hello@subashstudio.com
              </a>
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" /> Ahil Complex, S Bypass Rd, next to selam RR briyani, Vasanth Nagar, Tirunelveli, Tamil Nadu 627005
              </div>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <a href="https://wa.me/+919345706609" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-bg-soft/25 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaWhatsapp /></a>
              <a href="https://www.instagram.com/subash_studio/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-bg-soft/25 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaInstagram /></a>
            </div>
          </div>

          <div className="rounded-md overflow-hidden shadow-card border border-line/60 h-64">
            <iframe
              title="SUBASH STUDIO location"
              src="https://www.google.com/maps?q=subashstudio,Kalladaikurichi,TamilNadu&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
