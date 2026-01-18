import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ScrollReveal({ children, delay = 0, className = '', direction = 'up' }) {
  const { ref, isInView } = useScrollReveal();

  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
    fade:  { hidden: { opacity: 0 },         visible: { opacity: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction] || variants.up}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
