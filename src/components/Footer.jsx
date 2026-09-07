import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import Logomark from "./Logomark";
import { useAdminData } from "../admin/context/AdminDataContext";

export default function Footer() {
  const { branches } = useAdminData();
  
  const tirunelveliBranch = (branches && branches.find((b) => b.city?.toLowerCase().includes("tirunelveli"))) || {
    name: "Tirunelveli Studio & Gallery",
    city: "Tirunelveli",
    tag: "Studio & Gallery",
    address: "Ahil Complex, S Bypass Rd, next to selam RR briyani, Vasanth Nagar, Tirunelveli, Tamil Nadu 627005",
    phone: "+91 93457 06609",
    mapsUrl: "https://maps.app.goo.gl/hh7A1jwk1hhb8svr9",
  };

  const kalladaiBranch = (branches && branches.find((b) => b.city?.toLowerCase().includes("kalladaikurichi"))) || {
    name: "Kalladaikurichi Flagship Studio",
    city: "Kalladaikurichi",
    tag: "Flagship Studio",
    address: "88 Main Road, Kalladaikurichi, Tamil Nadu 627416",
    phone: "+91 93457 06609",
    mapsUrl: "https://maps.google.com/?q=Subash+Studio+Kalladaikurichi",
  };

  return (
    <footer className="bg-ink text-bg-soft/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm">
              <Logomark size={28} />
            </div>
            <span className="font-display text-lg tracking-[0.18em] text-bg-soft">SUBASH STUDIO</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-bg-soft/60 mb-5">
            A fine photography and cinematography house crafting timeless imagery
            across Kalladaikurichi and Tirunelveli — one honest frame at a time.
          </p>
          <div className="space-y-2 text-xs text-bg-soft/75 mb-6">
            <a href="tel:+919345706609" className="flex items-center gap-2.5 hover:text-gold transition-colors">
              <Phone size={13} className="text-gold shrink-0" />
              <span>+91 93457 06609</span>
            </a>
            <a href="mailto:hello@subashstudio.com" className="flex items-center gap-2.5 hover:text-gold transition-colors">
              <Mail size={13} className="text-gold shrink-0" />
              <span>hello@subashstudio.com</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/919345706609" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaWhatsapp size={15} /></a>
            <a href="https://instagram.com/subash_studio" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaInstagram size={15} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaFacebookF size={14} /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" className="w-9 h-9 rounded-full border border-bg-soft/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"><FaPinterestP size={14} /></a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/frames" className="hover:text-gold transition-colors">Order Frames</Link></li>
            <li><Link to="/portfolio" className="hover:text-gold transition-colors">Portfolio</Link></li>
            <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
            <li><Link to="/films" className="hover:text-gold transition-colors">Films</Link></li>
            <li><Link to="/branches" className="hover:text-gold transition-colors">Branches</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Tirunelveli Studio</h4>
          <div className="space-y-3 text-xs leading-relaxed text-bg-soft/75">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider bg-gold/15 text-gold border border-gold/30">
              Studio & Gallery
            </span>
            <div className="flex items-start gap-2 pt-1">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
              <span>{tirunelveliBranch.address}</span>
            </div>
            <p className="text-bg-soft/60 pl-5">Mon – Sun: 08:00 AM – 09:00 PM</p>
            <div className="pt-1 pl-5">
              <a
                href={tirunelveliBranch.mapsUrl || "https://maps.app.goo.gl/hh7A1jwk1hhb8svr9"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-gold hover:text-bg-soft transition-colors font-medium"
              >
                <span>View on Map</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold-light mb-5">Kalladaikurichi Studio</h4>
          <div className="space-y-3 text-xs leading-relaxed text-bg-soft/75">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider bg-gold/15 text-gold border border-gold/30">
              Flagship Atelier
            </span>
            <div className="flex items-start gap-2 pt-1">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
              <span>{kalladaiBranch.address}</span>
            </div>
            <p className="text-bg-soft/60 pl-5">Mon – Sun: 08:00 AM – 09:00 PM</p>
            <div className="pt-1 pl-5">
              <a
                href={kalladaiBranch.mapsUrl || "https://maps.google.com/?q=Subash+Studio+Kalladaikurichi"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-gold hover:text-bg-soft transition-colors font-medium"
              >
                <span>View on Map</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
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
