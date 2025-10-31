import React from 'react';
import { Repeat2 } from 'lucide-react';

// NOTE: This page is simplified to compile cleanly and avoid module not found errors.
// The main trading logic is in app/exchange/page.jsx

const PRIMARY_ACCENT_BG = 'bg-amber-500';
const PRIMARY_HOVER_BG_CLASS = 'hover:bg-amber-600';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
      <div className="text-center space-y-6 max-w-lg">
        <Repeat2 className={`w-16 h-16 mx-auto text-amber-500`} />
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome to <span className="text-amber-500">AfroDex</span>
        </h1>
        <p className="text-gray-400 text-lg">
          The hub for African Decentralized Finance. Navigate to the Exchange to begin trading.
        </p>
        <a
          href="/exchange"
          className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-gray-900 ${PRIMARY_ACCENT_BG} ${PRIMARY_HOVER_BG_CLASS} transition duration-150 ease-in-out`}
        >
          Go to Trading Exchange
        </a>
      </div>
    </div>
  );
}
