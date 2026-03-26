import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function HireMeButton() {
  const { settings } = useSettings();
  // read from CMS so it can be updated without redeploying
  const buttonText = settings?.floatingButtonText || 'Build Something';
  const [show, setShow] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling past hero
    const heroEl = document.getElementById('hero');
    const contactEl = document.getElementById('contact');

    const heroObs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    const contactObs = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (heroEl) heroObs.observe(heroEl);
    if (contactEl) contactObs.observe(contactEl);

    return () => { heroObs.disconnect(); contactObs.disconnect(); };
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && !contactVisible && (
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToContact}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-blue text-white font-body font-medium text-sm shadow-lg shadow-blue/30 hover:bg-blue/90 transition-colors"
          aria-label="Scroll to contact section"
        >
          <Briefcase size={14} />
          {buttonText}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
