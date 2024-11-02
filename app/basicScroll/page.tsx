"use client"
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

// Register GSAP plugins
gsap.registerPlugin(Observer);

const GsapCarousel = () => {
  const mainRef = useRef(null);
  const sectionsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(sectionsRef.current.slice(1), { yPercent: 100 });
      
      let currentIndex = 0;
      let animating = false;

      // Animation function
      function gotoSection(index, direction) {
        if (animating) return;
        
        // Bound the index
        index = Math.max(0, Math.min(index, sectionsRef.current.length - 1));
        
        if (currentIndex === index) return;

        animating = true;
        
        const currentSection = sectionsRef.current[currentIndex];
        const nextSection = sectionsRef.current[index];
        const isMovingDown = direction > 0;

        // Create timeline for smooth animation
        const tl = gsap.timeline({
          onComplete: () => {
            animating = false;
            currentIndex = index;
          }
        });

        // Animate sections
        tl.to(currentSection, {
          yPercent: isMovingDown ? -100 : 100,
          duration: 1,
          ease: "power2.inOut"
        })
        .fromTo(nextSection, 
          { 
            yPercent: isMovingDown ? 100 : -100 
          },
          { 
            yPercent: 0,
            duration: 1,
            ease: "power2.inOut"
          },
          "<"
        );

        // Animate content
        const currentContent = currentSection.querySelector('.content');
        const nextContent = nextSection.querySelector('.content');

        tl.fromTo(currentContent,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.8, duration: 0.5 },
          0
        )
        .fromTo(nextContent,
          { opacity: 0, scale: 1.2 },
          { opacity: 1, scale: 1, duration: 0.5 },
          0.5
        );
      }

      // Setup Observer for scroll detection
      Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => {
          if (!animating) {
            gotoSection(currentIndex + 1, 1);
          }
        },
        onUp: () => {
          if (!animating) {
            gotoSection(currentIndex - 1, -1);
          }
        },
        tolerance: 10,
        preventDefault: true
      });

      // Progress Indicator setup
      const indicators = document.querySelectorAll('.progress-dot');
      indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const direction = index > currentIndex ? 1 : -1;
          gotoSection(index, direction);
        });
      });

    }, mainRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  const sections = [
    { title: "Welcome", subtitle: "Scroll to explore", color: "bg-indigo-600" },
    { title: "About Us", subtitle: "Our Story", color: "bg-purple-600" },
    { title: "Services", subtitle: "What we offer", color: "bg-pink-600" },
    { title: "Contact", subtitle: "Get in touch", color: "bg-rose-600" }
  ];

  return (
    <div ref={mainRef} className="h-screen w-full overflow-hidden relative">
      {/* Progress Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            className="progress-dot w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all"
          />
        ))}
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <section
          key={index}
          ref={el => sectionsRef.current[index] = el}
          className={`absolute top-0 left-0 w-full h-full ${section.color}`}
        >
          <div className="content absolute w-full h-full flex flex-col items-center justify-center text-white">
            <h2 className="text-6xl font-bold mb-4">{section.title}</h2>
            <p className="text-xl opacity-80">{section.subtitle}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default GsapCarousel;