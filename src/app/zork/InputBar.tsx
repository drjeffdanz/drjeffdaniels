'use client';

import { type KeyboardEvent, type RefObject, useState } from 'react';

interface InputBarProps {
  onSubmit: (cmd: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

export default function InputBar({ onSubmit, inputRef, disabled }: InputBarProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
    setValue('');
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setValue(history[nextIndex] ?? '');
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      setValue(nextIndex === -1 ? '' : (history[nextIndex] ?? ''));
    }
  }

  return (
    <div className="border-t border-[#252525] bg-[#141414]/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
        <span className="text-gold font-mono text-sm font-bold select-none flex-shrink-0">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          aria-label="Command input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 bg-transparent border-none outline-none text-[#ededed] font-mono text-sm caret-gold placeholder-[#a3a3a3]/50 disabled:opacity-40"
          placeholder="Enter command..."
        />
      </div>
    </div>
  );
}
