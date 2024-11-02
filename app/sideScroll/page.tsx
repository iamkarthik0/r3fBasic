"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function ScrollAnimation() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(Observer);
    gsap.registerPlugin(useGSAP);
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<(HTMLDivElement | null)[]>([]);
  const animatingRef = useRef(false);

  const sections = [
    "bg-red-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-green-400",
    "bg-green-300",
    "bg-green-200",
  ];

  useGSAP(() => {
 gsap.set(sectionRef.current.slice(1), { yPercent: 100 });
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const gotoSection = (index: number, direction: number) => {
        if (animatingRef.current) return;

        const newIndex = Math.max(0, Math.min(index, sections.length - 1));
        if (currentIndex === newIndex) return;

        animatingRef.current = true;
        const isMovingDown = direction > 0;
        const currentSection = sectionRef.current[currentIndex];
        const nextSection = sectionRef.current[newIndex];

        const tl = gsap.timeline({
          onComplete: () => {
            animatingRef.current = false;
            setCurrentIndex(newIndex);
          },
        });

        tl.to(currentSection, {
          yPercent: isMovingDown ? 0 : 100,
          duration: 0.2,
          ease: "power2.inOut",
        }).fromTo(
          nextSection,
          { yPercent: isMovingDown ? 100 : 0 },
          { yPercent: 0, duration: 0.5, ease: "power2.inOut" },
          "<"
        );
      };

      Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () =>
          !animatingRef.current && gotoSection(currentIndex - 1, -1),
        onUp: () => !animatingRef.current && gotoSection(currentIndex + 1, 1),
        tolerance: 10,
        preventDefault: true,
      });
    });

    return () => ctx.revert();
  }, [currentIndex, sections.length]);

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {sections.map((item, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRef.current[index] = el;
          }}
          className={`${item} w-full h-full absolute transform `}
        >
          <h1 className=" text-7xl">asdasdasd</h1>
        </div>
      ))}
    </div>
  );
}
