'use client';

import { ChevronDown } from 'lucide-react';

export function AccordionItem({ 
  question, 
  answer,
  isOpen,
  onClick
}: { 
  question: string; 
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div 
      className="border-b border-border-subtle py-4 cursor-pointer group" 
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] sm:text-[16px] font-medium text-charcoal group-hover:text-oxblood transition-colors">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-stone transition-all duration-500 ease-in-out ${
            isOpen ? "rotate-180 text-oxblood" : ""
          }`}
        />
      </div>
      <p 
        className={`text-[14.5px] text-stone leading-relaxed transition-all duration-500 ease-in-out max-w-xl ${
          isOpen ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"
        }`}
      >
        {answer}
      </p>
    </div>
  );
}