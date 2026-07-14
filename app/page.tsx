'use client';

import React, { useState } from 'react';

export default function Vibecut() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050505]/95 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[76px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-white flex items-center justify-center">
                <span className="text-[#050505] font-semibold text-[21px] tracking-[-1.5px] mt-[-1px]">V</span>
              </div>
              <div className="font-semibold text-[21px] tracking-[-1px]">Vibecut</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-9 text-sm">
            <a href="#how" className="text-white/60 hover:text-white transition-colors duration-200">How it works</a>
            <a href="#pricing" className="text-white/60 hover:text-white transition-colors duration-200">Pricing</a>
            
            <div className="flex items-center gap-3 ml-2">
              <button className="px-5 py-2 text-sm text-white/80 hover:text-white transition-colors">
                Log in
              </button>
              <button 
                onClick={() => window.location.href = '#start'}
                className="px-6 py-[10px] rounded-2xl bg-white text-[#050505] text-sm font-semibold hover:bg-white/90 active:scale-[0.985] transition-all"
              >
                Start free
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white/80"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] px-6 py-6 bg-[#050505]">
            <div className="flex flex-col gap-4 text-sm">
              <a href="#how" className="text-white/80 py-1">How it works</a>
              <a href="#pricing" className="text-white/80 py-1">Pricing</a>
              <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
                <button className="text-left text-white/80 py-1">Log in</button>
                <button 
                  onClick={() => window.location.href = '#start'}
                  className="w-full py-3 rounded-2xl bg-white text-[#050505] font-semibold"
                >
                  Start free
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <div className="pt-20 pb-16 px-6 max-w-[980px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm mb-8 tracking-[0.2px]">
          Private beta
        </div>

        <h1 className="text-[clamp(2.4rem,9vw,5.2rem)] leading-[0.98] font-semibold tracking-[-4.5px] mb-6">
          Video editing,<br />reimagined.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 tracking-[-0.4px] max-w-[620px] mx-auto mb-10">
          The first AI that actually understands how creators edit.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.href = '#start'}
            className="w-full sm:w-auto h-14 px-10 rounded-3xl bg-[#3b82f6] text-white text-[17px] font-semibold hover:bg-[#3b82f6]/90 active:scale-[0.985] transition-all"
          >
            Start creating — free
          </button>
          <button className="w-full sm:w-auto h-14 px-8 rounded-3xl border border-white/20 hover:bg-white/[0.03] text-[17px] font-medium transition-all">
            Watch demo
          </button>
        </div>
        
        <div className="mt-8 text-sm text-white/40 tracking-[0.3px]">
          No card required • 3 free videos
        </div>
      </div>

      {/* Trust */}
      <div className="border-y border-white/[0.06] py-7">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center text-white/40 text-sm tracking-[2px]">
          BUILT FOR SERIOUS CREATORS
        </div>
      </div>

      {/* How it works */}
      <div id="how" className="max-w-6xl mx-auto px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 md:mb-12 px-1">
          <div>
            <div className="text-[#22c55e] text-sm tracking-[3px] font-medium mb-3">HOW IT WORKS</div>
            <div className="text-5xl md:text-6xl font-semibold tracking-[-2.4px]">Three steps.<br />Zero editing.</div>
          </div>
          <div className="text-white/50 max-w-[280px] text-[15px] leading-tight mt-4 md:mt-0">
            Our AI was trained on thousands of hours of professional edits.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { num: "01", title: "Upload", desc: "Drop raw clips or connect your phone. We support every major format." },
            { num: "02", title: "Brief", desc: "Answer 6 smart questions. Our AI captures your exact creative vision." },
            { num: "03", title: "Deliver", desc: "Receive a finished edit + full project file. Ready to publish." }
          ].map((step, i) => (
            <div key={i} className="group border border-white/[0.06] hover:border-white/15 transition-all duration-300 rounded-3xl p-9 bg-white/[0.012] flex flex-col">
              <div className="font-mono text-[13px] tracking-[4px] text-white/40 mb-8">{step.num}</div>
              <div className="text-4xl font-semibold tracking-[-1.8px] mb-auto">{step.title}</div>
              <p className="text-[15px] text-white/60 leading-snug mt-6 pr-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div id="start" className="py-20 text-center px-8 border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto">
          <div className="text-[56px] md:text-[68px] leading-none font-semibold tracking-[-3.2px] mb-8">Ready to 10x your output?</div>
          
          <button className="w-full sm:w-auto h-16 px-14 rounded-3xl bg-[#3b82f6] text-white text-xl font-semibold hover:bg-[#3b82f6]/90 active:scale-[0.985] transition-all">
            Start your first project
          </button>
          
          <div className="mt-5 text-sm text-white/40">Takes under 90 seconds to create your first video</div>
        </div>
      </div>
    </div>
  );
}
