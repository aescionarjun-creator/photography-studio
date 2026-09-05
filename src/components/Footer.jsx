import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";
import Logomark from "./Logomark";
import { useAdminData } from "../admin/context/AdminDataContext";

export default function Footer() {
  const { branches } = useAdminData();
  const activeBranch = (branches && branches.find((b) => b.active !== false)) || {
    address: "88 Main Road, Kalladaikurichi",
    city: "Kalladaikurichi, Tamil Nadu 627416",
    phone: "+91 93457 06609",
    email: "hello@subashstudio.com",
  };

  return (
    <footer className="bg-ink text-bg-soft/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm">
              <Logomark size={28} />
            </div>
            <span className="font-display text-lg tracking-[0.18em] text-bg-soft">SUBASH STUDIO</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-bg-soft/60">
            A fine photography and cinematography house crafting timeless imagery
            across Kalladaikurichi and Tirunelveli — one honest frame at a time.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="https://wa.me/919345706609" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaWhatsapp /></a>
            <a href="https://instagram.com/subash_studio" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaFacebookF /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaPinterestP /></a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/frames" className="hover:text-gold transition-colors">Order Frames</Link></li>
            <li><Link to="/portfolio" className="hover:text-gold transition-colors">Portfolio</Link></li>
            <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
            <li><Link to="/films" className="hover:text-gold transition-colors">Films</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Studio</h4>
          <ul className="space-y-3 text-sm text-bg-soft/70">
            <li>{activeBranch.address}</li>
            <li>{activeBranch.city}</li>
            <li>{activeBranch.email || "hello@subashstudio.com"}</li>
            <li>{activeBranch.phone}</li>
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
