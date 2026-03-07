'use client';

import { type RefObject } from 'react';
import type { OutputLine } from './types';

interface OutputPaneProps {
  lines: OutputLine[];
  bottomRef: RefObject<HTMLDivElement | null>;
}

const lineClass: Record<OutputLine['type'], string> = {
  title: 'text-gold font-bold mt-4 first:mt-0',
  command: 'text-[#c8956c]/70 mt-3',
  narrative: 'text-[#ededed] leading-relaxed',
  system: 'text-[#a3a3a3]',
  error: 'text-red-400',
  success: 'text-emerald-400 font-bold',
};

export default function OutputPane({ lines, bottomRef }: OutputPaneProps) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      aria-live="polite"
      aria-label="Game output"
    >
      <div className="max-w-4xl mx-auto px-6 py-8 pb-4">
        {lines.map((l) =>
          l.text === '' ? (
            <div key={l.id} className="h-3" />
          ) : (
            <p key={l.id} className={`text-sm font-mono whitespace-pre-wrap ${lineClass[l.type]}`}>
              {l.text}
            </p>
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
