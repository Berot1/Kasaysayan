'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-[#E6E2D8] first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 sm:py-10 flex items-center justify-between gap-4 text-left group"
      >
        {/* Using font-display (Serif) for authority */}
        <span className="text-[17px] sm:text-[20px] font-medium text-charcoal group-hover:text-oxblood transition-colors">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 shrink-0 text-stone transition-transform duration-500 ${isOpen ? 'rotate-180 text-oxblood' : ''}`} 
        />
      </button>
      <div 
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6 sm:pb-10' : 'grid-rows-[0fr] opacity-0'}`}
      >
        {/* Increased line-height and font size for better reading experience */}
        <p className="text-[15px] sm:text-[16px] text-stone leading-relaxed overflow-hidden max-w-2xl">
          {answer}
        </p>
      </div>
    </div>
  );
}