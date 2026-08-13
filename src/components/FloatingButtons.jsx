import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-7 right-6 lg:bottom-9 lg:right-9 z-40 flex flex-col gap-4">
      <motion.a
        href="https://www.instagram.com/subash_studio/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="w-12 h-12 rounded-full bg-card shadow-soft border border-line flex items-center justify-center text-ink/70 hover:text-gold-dark hover:border-gold transition-colors"
      >
        <FaInstagram size={19} />
      </motion.a>
      <motion.a
        href="https://wa.me/+919345706609"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-full bg-[#25D366] shadow-soft flex items-center justify-center text-white hover:brightness-95 transition"
      >
        <FaWhatsapp size={20} />
      </motion.a>
    </div>
  );
}
