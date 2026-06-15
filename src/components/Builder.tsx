import React from 'react';
import { useStore } from '../store/useStore';
import ControlPanel from './ControlPanel';
import Canvas from './Canvas';
import Exporter from './Exporter';

export default function Builder() {
  const { breakpoint, setBreakpoint } = useStore();

  return (
    <div className="flex-1 flex flex-col xl:grid xl:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden max-w-[1600px] mx-auto w-full">
      {/* Left: Control Panel (3 cols) */}
      <aside className="xl:col-span-3 flex flex-col min-h-0 bg-gray-900/40 border border-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <ControlPanel />
      </aside>

      {/* Right Area (9 cols): Canvas Top, Exporter Bottom */}
      <div className="xl:col-span-9 flex flex-col gap-6 min-h-0">
        {/* Center: Canvas Workspace */}
        <section className="flex flex-col min-h-[500px] bg-gray-900/20 border border-gray-800/50 rounded-xl overflow-hidden relative">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-850 bg-gray-950/40 backdrop-blur-md">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/85"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/85"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/85"></span>
              <span className="text-xs text-gray-500 font-medium ml-2 select-none">Preview Canvas</span>
            </div>

            {/* Breakpoint Toggles */}
            <div className="flex bg-gray-900/80 p-0.5 rounded-lg border border-gray-800/60">
              {(['mobile', 'tablet', 'desktop'] as const).map((bp) => (
                <button
                  key={bp}
                  onClick={() => setBreakpoint(bp)}
                  className={`px-3 py-1 text-2xs font-semibold rounded-md uppercase tracking-wider transition-all duration-200 ${
                    breakpoint === bp
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                  }`}
                >
                  {bp}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Container */}
          <div className="flex-1 overflow-auto p-6 flex justify-center items-start min-h-[400px]">
            <Canvas />
          </div>
        </section>

        {/* Bottom: Exporter */}
        <aside className="bg-gray-900/40 border border-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
          <Exporter />
        </aside>
      </div>
    </div>
  );
}
