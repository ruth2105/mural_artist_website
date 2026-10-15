import { useState } from 'react';

export default function DevNotice() {
  const [dismissed, setDismissed] = useState(false);

  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

  // Don't show if configured or dismissed
  if (isConfigured || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md">
      <div className="bg-yellow-500/90 backdrop-blur-sm text-near-black p-4 rounded-lg shadow-xl border-2 border-yellow-600">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-bold mb-1">CMS Not Configured</h3>
            <p className="text-sm mb-2">
              The admin dashboard and dynamic content require Supabase setup.
            </p>
            <p className="text-xs mb-3">
              📖 Follow <strong>CMS_SETUP_GUIDE.md</strong> to enable the full system.
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs px-3 py-1 bg-near-black text-yellow-500 rounded hover:bg-charcoal transition-colors"
            >
              Got it, dismiss
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-near-black/50 hover:text-near-black"
            aria-label="Close"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="15" y1="5" x2="5" y2="15" />
              <line x1="5" y1="5" x2="15" y2="15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
