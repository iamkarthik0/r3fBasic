'use client' // ye important hai - Next.js mein client component declare karne ke liye

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTrigger ko register karna zaroori hai
gsap.registerPlugin(ScrollTrigger)

export default function page() {
    const elementRef = useRef(null)
    
    useLayoutEffect(() => {
        // Context create karte hain taki cleanup proper ho
        const ctx = gsap.context(() => {
            
            ScrollTrigger.create({
                // Kaunsa element trigger karega
                trigger: elementRef.current,
                
                // Kahan se kahan tak animation chalegi
                start: "top center", // jab element ka top viewport ke center pe aayega
                end: "bottom center",  // jab element ka bottom viewport ke center pe aayega
                
                // Animation behavior
                markers: true,  // development mein helpful hota hai debug ke liye
                
                // Scroll ke saath kya behavior chahiye
                toggleActions: "play pause reverse reset",
                // Format: "onEnter onLeave onEnterBack onLeaveBack"
                
                // Optional animation
                animation: gsap.to(elementRef.current, {
                    y: 100,
                    duration: 1,
                    opacity: 0
                }),
                
                // Scroll ke saath pin karna hai?
                pin: false,
                
                // ScrollTrigger events
                onEnter: () => console.log("Element enter hua"),
                onLeave: () => console.log("Element leave hua"),
                onEnterBack: () => console.log("Element vapas enter hua"),
                onLeaveBack: () => console.log("Element vapas leave hua"),
                
                // Scrub mode - scroll ke saath smooth animation
                scrub: 1, // 1 second ka smooth scrub
            })
        })
        
        // Cleanup important hai
        return () => ctx.revert()
    }, [])
    
    return (
        <div ref={elementRef} className="h-[500px] w-full bg-blue-500">
            Scroll karo aur magic dekho!
        </div>
    )
}