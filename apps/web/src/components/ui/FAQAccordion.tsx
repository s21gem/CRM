'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isActive = activeIndex === index;
        return (
          <div 
            key={index} 
            className="border border-border rounded-lg bg-white dark:bg-zinc-900 overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-semibold text-foreground text-lg">{faq.question}</span>
              <svg 
                className={`w-5 h-5 text-muted-foreground transform transition-transform ${isActive ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
