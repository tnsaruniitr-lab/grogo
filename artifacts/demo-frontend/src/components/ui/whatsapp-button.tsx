import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export function WhatsappButton() {
  return (
    <motion.a
      href="https://wa.me/+4915901234567?text=Hallo%2C+ich+interessiere+mich+f%C3%BCr+Ihre+Pflegeleistungen."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#22bf5b] transition-colors hover-elevate"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-testid="link-whatsapp-floating"
    >
      <FaWhatsapp className="h-8 w-8" />
    </motion.a>
  );
}
