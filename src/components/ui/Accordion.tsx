"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface AccordionItemProps {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight;
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className={`
        glass-card overflow-hidden
        transition-all duration-300 ease-out
        ${isOpen ? "shadow-lg" : ""}
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-5 py-3.5 flex items-center justify-between text-left
          transition-all duration-300
          hover:bg-[var(--bg-glass-heavy)]
          ${isOpen ? "bg-[var(--bg-glass-heavy)]" : ""}
        `}
      >
        <span className="font-medium text-base pr-4">{question}</span>
        <div
          className={`
            flex items-center justify-center w-7 h-7 rounded-full
            bg-[var(--bg-glass)] transition-all duration-300
            ${isOpen ? "bg-[var(--foreground)] text-[var(--background)] rotate-180" : ""}
          `}
        >
          <svg
            className="w-4 h-4 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ height: height }}
        className="transition-all duration-300 ease-out overflow-hidden"
      >
        <div
          className={`
            px-6 pb-5 text-[var(--muted-foreground)] leading-relaxed
            transition-all duration-300 delay-100
            ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <div className="space-y-2">{children}</div>;
}
