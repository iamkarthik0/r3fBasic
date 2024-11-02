"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  useEffect(() => {
    const container = containerRef.current;
    const box = boxRef.current;
    const tl = gsap.timeline();
    if (typeof window !== "undefined" && container && box) {
      tl.to(box, {
        y: active == 1 ? -(container?.offsetHeight - box?.offsetHeight) : (container?.offsetHeight - box?.offsetHeight) ,
        ease: "power2.out",
     
        duration: 0.7,
      });
    }

    return () => {
      tl.kill();
    };
  }, [active]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.observe({
        target: window,
        type: "wheel,press,pointer",
        onChange: (self) => {
          setActive(Math.sign(self.deltaY));
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  return (
    <div className="relative bg-slate-300 min-h-screen">
      <div className="fixed inset-0 flex items-center justify-center z-10"></div>

      <div
        ref={containerRef}
        className="relative min-h-screen bg-emerald-200 flex overflow-hidden  items-end"
      >
        <div ref={boxRef} className=" min-h-screen w-full bg-black z-10"></div>
      </div>
    </div>
  );
};

export default Page;
