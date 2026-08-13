import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-ink text-bg-soft/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full border border-gold flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" />
            </span>
            <span className="font-display text-lg tracking-[0.18em] text-bg-soft">SUBASH STUDIO</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-bg-soft/60">
            A fine photography and cinematography house crafting timeless imagery
            across Chennai, Coimbatore and Madurai — one honest frame at a time.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaWhatsapp /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaFacebookF /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaPinterestP /></a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-gold transition-colors">Portfolio</Link></li>
            <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
            <li><Link to="/films" className="hover:text-gold transition-colors">Films</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Studio</h4>
          <ul className="space-y-3 text-sm text-bg-soft/70">
            <li>88 Main Road, Kalladaikurich</li>
            <li>Kalladaikurichi, Tamil Nadu 627416</li>
            <li>hello@subashstudio.com</li>
            <li>+91 93457 06609</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bg-soft/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-bg-soft/45">
          <p>© {new Date().getFullYear()} SUBASH STUDIO. All rights reserved.</p>
          <p>Crafted with care, one frame at a time.</p>
        </div>
      </div>
    </footer>
  );
}
