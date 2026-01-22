import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    const moveDot = (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };
    window.addEventListener('mousemove', moveDot, { passive: true });

    const animate = () => {
      // Dot tracks instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`;
        dotRef.current.style.top = `${dotY}px`;
      }
      // Ring lags behind
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Expand ring on interactive elements
    const onEnter = () => setExpanded(true);
    const onLeave = () => setExpanded(false);
    const els = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    els.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveDot);
      cancelAnimationFrame(raf);
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className={`custom-cursor-ring ${expanded ? 'expanded' : ''}`} aria-hidden="true" />
    </>
  );
}
