'use client';

import { useEffect, useReducer, useRef } from 'react';
import InputBar from './InputBar';
import OutputPane from './OutputPane';
import { buildInitialState } from './initialState';
import { gameReducer } from './reducer';

export default function ZorkTerminal() {
  const [state, dispatch] = useReducer(gameReducer, undefined, buildInitialState);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [state.output.length]);

  // Keep input focused
  useEffect(() => {
    inputRef.current?.focus();
  }, [state.output.length]);

  function handleCommand(cmd: string) {
    dispatch({ type: 'PROCESS_COMMAND', payload: cmd });
  }

  return (
    <div
      className="flex flex-col bg-[#0a0a0a]"
      style={{ height: 'calc(100vh - 73px)' }}
      onClick={() => inputRef.current?.focus()}
    >
      <OutputPane lines={state.output} bottomRef={bottomRef} />
      <InputBar
        onSubmit={handleCommand}
        inputRef={inputRef}
        disabled={false}
      />
    </div>
  );
}
