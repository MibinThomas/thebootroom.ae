"use client";

import { useState } from 'react';

/**
 * A simple modal component to display terms and conditions. It accepts a string of
 * terms and splits it into paragraphs for easier reading. When the modal is
 * opened, it overlays the page with a semi-transparent backdrop.
 */
export default function TermsModal({ terms }: { terms: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button styled to match the retro palette */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-secondary text-primary font-heading px-4 py-2 rounded shadow uppercase tracking-wider"
      >
        View Terms &amp; Conditions
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-background text-foreground max-w-xl w-full p-6 rounded-lg relative">
            <h2 className="text-2xl font-heading mb-4">Terms &amp; Conditions</h2>
            <div className="h-64 overflow-y-auto space-y-3 pr-2">
              {terms.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-sm leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-foreground hover:text-secondary"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}