"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const sections = [
    " bg-red-500",
    " bg-green-200",
    "bg-blue-200",
    "bg-black-300",
  ];
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentItem, setCurrentItem] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial setup for each section to be out of view
    sectionRefs.current.forEach((section) => {
      if (section) {
        gsap.set(section, { yPercent: 100 });
      }
    });

    // ScrollTrigger setup for each section
    sectionRefs.current.forEach((section, index) => {
      if (section) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          onEnter: () => {
            setCurrentItem(index);
          },
          onEnterBack: () => {
            setCurrentItem(index);
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    gsap.to(sectionRefs.current[currentItem], {
      yPercent: 0,
      duration: 0.6,
    });
  }, [currentItem]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-slate-400 overflow-hidden"
    >
      <div className="min-h-screen bg-cyan-300 fixed w-full"></div>

      <div className="relative min-h-screen w-full overflow-visible">
        {sections.map((item, index) => (
          <div
            className={`${item} min-h-screen w-full absolute z-10`}
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
          >
            <h1>{sections[currentItem]}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
