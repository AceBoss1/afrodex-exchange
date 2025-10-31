import React, { useState, useCallback, useMemo } from 'react';
import { Repeat2, Zap, ArrowDown, ArrowUp, Loader2, RefreshCw } from 'lucide-react';

// --- Utility Functions (Fixes "cn is not defined" error) ---

/**
 * A minimal implementation of the clsx / classnames logic for merging classes.
 * Since we can't import external libraries, we define a basic utility here.
 * NOTE: For full Tailwind merge capability, a more complex implementation is required.
 * This version handles basic class concatenation and object/array conditions.
 */
function cn(...inputs) {
    const classes = [];
    for (const input of inputs) {
        if (typeof input === 'string') {
            classes.push(input);
        } else if (Array.isArray(input)) {
            classes.push(cn(...input));
        } else if (typeof input === 'object' && input !== null) {
            for (const key in input) {
                if (input[key]) {
                    classes.push(key);
                }
            }
        }
    }
    return classes.filter(Boolean).join(' ');
}

// --- Mock Data and Constants ---

const MOCK_ASSETS = [
    { name: 'AFRO', icon: '🌍', balance: 1250.00, address: '0xAfroTokenAddress' },
    { name: 'USDC', icon: '$', balance: 500.00, address: '0xUsdcTokenAddress' },
    { name: 'ETH', icon: 'Ξ', balance: 2.50, address: '0xEthTokenAddress' },
];

const MOCK_HISTORY = [
    { id: 1, type: 'Buy', asset: 'AFRO', amount: 100, price: 0.05, total: 5.00, date: '2024-10-25' },
    { id: 2, type: 'Sell', asset: 'AFRO', amount: 50, price: 0.051, total: 2.55, date: '2024-10-24' },
    { id: 3, type: 'Buy', asset: 'USDC', amount: 50, price: 0.99, total: 49.50, date: '2024-10-23' },
    { id: 4, type: 'Sell', asset: 'ETH', amount: 0.1, price: 3500, total: 350.00, date: '2024-10-22' },
];

const PRIMARY_COLOR = 'bg-amber-500';
const SECONDARY_COLOR = 'bg-gray-700';
const ACCENT_TEXT = 'text-amber-400';

// --- Component Definitions ---

// Helper component for input fields
const TradingInput = ({ label, value, onChange, asset, maxAction, isBase = false }) => (
    <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-300 flex justify-between">
            <span>{label}</span>
            {maxAction && (
                <button
                    onClick={maxAction}
                    className={`text-xs font-semibold ${ACCENT_TEXT} hover:text-amber-300 transition-colors`}
                >
                    MAX
                </button>
            )}
        </label>
        <div className={cn(SECONDARY_COLOR, "flex items-center rounded-lg p-3 shadow-inner ring-1 ring-gray-600 focus-within:ring-amber-500 transition-all")}>
            <input
                type="number"
                value={value}
                onChange={onChange}
                placeholder={isBase ? "0.00" : "Enter amount"}
                className="w-full bg-transparent text-white text-lg font-mono focus:outline-none placeholder-gray-500"
                min="0"
                step="any"
            />
            {asset && (
                <div className="flex items-center ml-3 text-white">
                    <span className="text-xl mr-2">{asset.icon}</span>
                    <span className="text-sm font-semibold">{asset.name}</span>
                </div>
            )}
        </div>
        {asset && (
            <p className="text-xs text-gray-400">
                Balance: {asset.balance.toFixed(2)} {asset.name}
            </p>
        )}
    </div>
);

// Helper component for the Buy/Sell forms
const TradeForm = ({ type, baseAsset, quoteAsset, isConnected }) => {
    const isBuy = type === 'Buy';
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('0.05'); // Mock price
    const [loading, setLoading] = useState(false);

    const handleMax = useCallback(() => {
        // Simple logic: Max amount to buy is (Quote Balance / Price)
        const max = isBuy
            ? (quoteAsset.balance / parseFloat(price)).toFixed(4)
            : baseAsset.balance.toFixed(4);
        setAmount(max > 0 ? max : '');
    }, [isBuy, baseAsset.balance, quoteAsset.balance, price]);

    const total = useMemo(() => {
        const amt = parseFloat(amount) || 0;
        const prc = parseFloat(price) || 0;
        return (amt * prc).toFixed(4);
    }, [amount, price]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isConnected || !amount || !price || parseFloat(amount) <= 0) return;

        setLoading(true);
        console.log(`${type} Order: ${amount} ${baseAsset.name} @ ${price} ${quoteAsset.name}/${baseAsset.name}`);

        // Mock API call simulation
        setTimeout(() => {
            setLoading(false);
            setAmount('');
            console.log("Order submitted successfully (mock)");
        }, 1500);
    };

    const buttonClass = isBuy
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-red-600 hover:bg-red-700';

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <TradingInput
                label={`Amount to ${type}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                asset={baseAsset}
                maxAction={handleMax}
            />

            <TradingInput
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                asset={{ name: quoteAsset.name, icon: quoteAsset.icon }}
                isBase={true}
            />

            <div className="p-3 rounded-lg bg-gray-700/50 flex justify-between text-sm text-gray-300">
                <span>Total Cost:</span>
                <span className="font-mono text-white">{total} {quoteAsset.name}</span>
            </div>

            <button
                type="submit"
                disabled={!isConnected || loading || parseFloat(amount) <= 0}
                className={cn(
                    'w-full py-3 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center',
                    buttonClass,
                    {
                        'opacity-50 cursor-not-allowed': !isConnected || loading || parseFloat(amount) <= 0,
                        'hover:scale-[1.01]': isConnected && !loading && parseFloat(amount) > 0,
                    }
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                    </>
                ) : isConnected ? (
                    `${type} ${baseAsset.name}`
                ) : (
                    'Connect Wallet'
                )}
            </button>
        </form>
    );
};

// Main Exchange Component
export default function ExchangePage() {
    const [tab, setTab] = useState('Trade'); // Trade or History
    const [isConnected, setIsConnected] = useState(true); // Mock connected state

    const baseAsset = MOCK_ASSETS.find(a => a.name === 'AFRO');
    const quoteAsset = MOCK_ASSETS.find(a => a.name === 'USDC');
    const currentPrice = 0.052; // Mock live price

    // --- Sub-Components ---

    const Header = () => (
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
                <Repeat2 className="w-6 h-6 text-amber-500 mr-2" />
                <h1 className="text-xl font-bold text-white">
                    <span className={ACCENT_TEXT}>{baseAsset.name}</span> / {quoteAsset.name}
                </h1>
            </div>
            <button
                onClick={() => setIsConnected(prev => !prev)}
                className={cn(
                    "py-2 px-4 rounded-full text-sm font-semibold transition-colors",
                    isConnected ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : PRIMARY_COLOR + ' text-gray-900 hover:bg-amber-600'
                )}
            >
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
        </header>
    );

    const PriceTile = () => (
        <div className="p-4 bg-gray-900 rounded-xl shadow-inner border border-gray-800 space-y-1">
            <p className="text-gray-400 text-sm">Last Price</p>
            <div className="flex items-center space-x-2">
                <span className="text-3xl font-extrabold text-white">
                    {currentPrice.toFixed(4)}
                </span>
                <span className="text-lg font-semibold text-green-400 flex items-center">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    +4.2%
                </span>
            </div>
            <p className="text-xs text-gray-500">
                ~{(1 / currentPrice).toFixed(2)} {baseAsset.name} / {quoteAsset.name}
            </p>
        </div>
    );

    const HistoryTable = () => (
        <div className="h-[400px] overflow-y-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="sticky top-0 bg-gray-800">
                    <tr>
                        {['Type', 'Amount', 'Price', 'Total', 'Date'].map(header => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {MOCK_HISTORY.map((trade) => {
                        const isBuy = trade.type === 'Buy';
                        return (
                            <tr key={trade.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className={cn("px-4 py-3 whitespace-nowrap text-sm font-medium", isBuy ? 'text-green-400' : 'text-red-400')}>
                                    <div className="flex items-center">
                                        {isBuy ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                        {trade.type}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-white">
                                    {trade.amount.toFixed(2)} {trade.asset}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">
                                    {trade.price.toFixed(4)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-white">
                                    {trade.total.toFixed(2)} {quoteAsset.name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                    {trade.date}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );


    // --- Main Layout Render ---
    return (
        <div className="min-h-screen bg-gray-950 font-sans">
            <style jsx global>{`
                /* Custom scrollbar for dark theme */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937; /* gray-800 */
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4b5563; /* gray-600 */
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #6b7280; /* gray-500 */
                }
            `}</style>
            <Header />

            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Column 1: Trading Forms */}
                    <div className="lg:col-span-1 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                        <div className="flex border-b border-gray-700">
                            <button
                                onClick={() => {}} // Buy Form is always visible
                                className="w-1/2 py-3 text-lg font-bold text-center text-white bg-green-700/50 border-r border-gray-700"
                            >
                                <ArrowUp className="w-4 h-4 inline mr-1 text-green-400" /> Buy
                            </button>
                            <button
                                onClick={() => {}} // Sell Form is always visible
                                className="w-1/2 py-3 text-lg font-bold text-center text-white bg-red-700/50"
                            >
                                <ArrowDown className="w-4 h-4 inline mr-1 text-red-400" /> Sell
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                            <TradeForm
                                type="Buy"
                                baseAsset={baseAsset}
                                quoteAsset={quoteAsset}
                                isConnected={isConnected}
                            />
                            <div className="border-t border-gray-700 lg:border-t-0 lg:border-l lg:h-full"></div>
                            <TradeForm
                                type="Sell"
                                baseAsset={baseAsset}
                                quoteAsset={quoteAsset}
                                isConnected={isConnected}
                            />
                        </div>
                    </div>

                    {/* Column 2 & 3: Market Data & History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PriceTile />
                            <div className="bg-gray-900 rounded-xl shadow-inner border border-gray-800 p-4 flex flex-col justify-center">
                                <p className="text-gray-400 text-sm">24h Volume ({baseAsset.name})</p>
                                <span className="text-2xl font-bold text-white">4.8M</span>
                            </div>
                            <div className="bg-gray-900 rounded-xl shadow-inner border border-gray-800 p-4 flex flex-col justify-center">
                                <p className="text-gray-400 text-sm">Your {baseAsset.name} Balance</p>
                                <span className="text-2xl font-bold text-white flex items-center">
                                    {baseAsset.balance.toFixed(2)}
                                    <span className="text-sm text-gray-500 ml-2">({baseAsset.icon})</span>
                                </span>
                            </div>
                        </div>

                        {/* Tabs: Orders / History */}
                        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
                            <div className="flex border-b border-gray-700">
                                <button
                                    onClick={() => setTab('Trade')}
                                    className={cn(
                                        "px-6 py-3 text-lg font-semibold transition-colors",
                                        tab === 'Trade' ? `border-b-2 border-amber-500 ${ACCENT_TEXT}` : 'text-gray-400 hover:text-gray-300'
                                    )}
                                >
                                    Open Orders
                                </button>
                                <button
                                    onClick={() => setTab('History')}
                                    className={cn(
                                        "px-6 py-3 text-lg font-semibold transition-colors",
                                        tab === 'History' ? `border-b-2 border-amber-500 ${ACCENT_TEXT}` : 'text-gray-400 hover:text-gray-300'
                                    )}
                                >
                                    Trade History
                                </button>
                                <button
                                    className="ml-auto p-3 text-gray-400 hover:text-white transition-colors"
                                    title="Refresh Data"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4">
                                {tab === 'Trade' && (
                                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                                        <Zap className="w-10 h-10 mb-2" />
                                        <p className="text-lg">No Open Orders</p>
                                        <p className="text-sm">Place a trade to see it here.</p>
                                    </div>
                                )}
                                {tab === 'History' && <HistoryTable />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
          <footer className={cn("py-4 text-center text-xs border-t mt-12", themeClasses.text_secondary, themeClasses.border)}>
              &copy; 2019-Present AfroDEX - Pioneering the future of decentralized finance.
            </footer>
        </div>
    );
}
