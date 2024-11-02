"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function page() {
  const [currentItem, setCurrentItem] = useState(0);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [sections, setSections] = useState([
    "section1",
    "section2",
    "section3",
    "section4",
  ]);

  const containerRef = useRef(null);

  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      sections.forEach((item, index) => {
        gsap.to(boxRefs.current[index], {
          xPercent: 100,
        });
      });
    });
    return () => {
      ctx.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.observe({
        target: window,
        type: "wheel,touch",
        onChange: (self) => {
          if (Math.sign(self.deltaY) > 0 && currentItem < sections.length - 1) {
            setCurrentItem(currentItem + 1);
          } else if (self.deltaY < 0 && currentItem > 0) {
            setCurrentItem(currentItem - 1);
          }
        },
      });
    });
    return () => {
      ctx.revert();
    };
  }, [currentItem]);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      // ScrollTrigger.create ka use
      ScrollTrigger.create({
        trigger: boxRefs.current[currentItem],
        start: "top center",
       end: "+=1",
        markers: true,
        pin: true,
        animation: gsap.to(boxRefs.current[currentItem], {
          backgroundColor: "red",
          x: 0,
          duration: 2,
        }),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [currentItem]);

  return (
    <div
      ref={containerRef}
      className=" relative w-full   bg-cyan-600  max-w-screen-2xl min-h-screen overflow-hidden"
    >
      {sections.map((item, index) => (
        <div
          className=" w-full min-h-screen absolute transform"
          key={index}
          ref={(el) => {
            boxRefs.current[index] = el;
          }}
        ></div>
      ))}
    </div>
  );
}
