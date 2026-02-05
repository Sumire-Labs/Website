"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Lab" },
  { href: "/faq", label: "FAQ" },
];

export function DynamicIsland() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeIndex = navItems.findIndex((item) => item.href === pathname);

  const updateSlider = useCallback((index: number) => {
    const item = itemRefs.current[index];
    const nav = navRef.current;
    if (item && nav) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      setSliderStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        opacity: 1,
      });
    }
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && !isHovering) {
      updateSlider(activeIndex);
    }
  }, [activeIndex, isHovering, updateSlider]);

  useEffect(() => {
    if (isHovering && hoverIndex !== null) {
      updateSlider(hoverIndex);
    } else if (activeIndex >= 0) {
      updateSlider(activeIndex);
    }
  }, [isHovering, hoverIndex, activeIndex, updateSlider]);

  const handleMouseEnter = (index: number) => {
    setIsHovering(true);
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoverIndex(null);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="dynamic-island px-3 py-2 flex items-center gap-1">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-1 rounded-full"
        >
          <Image
            src="/images/icon.png"
            alt="すみれさば"
            width={28}
            height={28}
            className="rounded-full"
          />
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/20 mx-1" />

        {/* Navigation Links with Sliding Indicator */}
        <div ref={navRef} className="relative flex items-center gap-0.5">
          {/* Sliding Background Indicator */}
          <div
            className="absolute top-0 h-full rounded-full bg-white/20 transition-all duration-300 ease-out"
            style={{
              left: sliderStyle.left,
              width: sliderStyle.width,
              opacity: sliderStyle.opacity,
              transform: isHovering ? 'scale(1.02)' : 'scale(1)',
            }}
          />

          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => { itemRefs.current[index] = el; }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                className={`
                  relative z-10 px-4 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 ease-out
                  active:scale-95
                  ${isActive ? "text-white" : "text-white/70 hover:text-white"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
