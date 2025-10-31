import React, { useState, useCallback, useMemo } from 'react';
import {
  Menu, X, ChevronDown, Clock, Search, Wallet, BarChart, Settings, Repeat2, Zap, ArrowDown, ArrowUp,
  Coins, LayoutDashboard, History
} from 'lucide-react';

// --- Configuration Constants ---

// 1. Markets Definition (Strictly Limited to 22 Pairs)
const ALL_MARKETS = [
    { base: 'AfroX', quote: 'ETH', price: '0.000345', change: 2.15, volume: 154560 },
    { base: 'PLAAS', quote: 'WETH', price: '0.000089', change: -1.02, volume: 98750 },
    { base: 'ADX', quote: 'USDT', price: '1.24', change: 5.50, volume: 550000 },
    { base: 'USDC', quote: 'ETH', price: '0.000258', change: -0.55, volume: 320000 },
    { base: 'ETH', quote: 'USDT', price: '3850.12', change: 1.88, volume: 9500000 },
    { base: 'AfroX', quote: 'USDC', price: '0.000346', change: 2.15, volume: 154560 },
    { base: 'PLAAS', quote: 'USDC', price: '0.000090', change: -1.02, volume: 98750 },
    { base: 'ADX', quote: 'WETH', price: '0.000325', change: 5.50, volume: 550000 },
    { base: 'USDT', quote: 'WETH', price: '0.000259', change: -0.55, volume: 320000 },
    { base: 'AfroX', quote: 'WETH', price: '0.000345', change: 2.15, volume: 154560 },
    { base: 'PLAAS', quote: 'ETH', price: '0.000089', change: -1.02, volume: 98750 },
    { base: 'ADX', quote: 'ETH', price: '0.000324', change: 5.50, volume: 550000 },
    { base: 'USDC', quote: 'WETH', price: '0.000258', change: -0.55, volume: 320000 },
    { base: 'ETH', quote: 'USDC', price: '3850.12', change: 1.88, volume: 9500000 },
    { base: 'WETH', quote: 'USDT', price: '3855.50', change: 1.85, volume: 8900000 },
    { base: 'BTC', quote: 'USDT', price: '68000.00', change: 0.12, volume: 12000000 },
    { base: 'SOL', quote: 'ETH', price: '0.045', change: -3.01, volume: 450000 },
    { base: 'BNB', quote: 'USDC', price: '595.00', change: 0.88, volume: 720000 },
    { base: 'DOT', quote: 'WETH', price: '0.0015', change: 4.00, volume: 110000 },
    { base: 'DOGE', quote: 'USDT', price: '0.155', change: -0.15, volume: 210000 },
    { base: 'XRP', quote: 'ETH', price: '0.00018', change: 1.10, volume: 310000 },
    { base: 'LTC', quote: 'USDT', price: '85.20', change: 3.20, volume: 180000 },
];

// 2. Color Scheme Constants
const PRIMARY_COLOR = 'amber-500'; // For accents, logo, active state
const PRIMARY_COLOR_HOVER = 'amber-600';
const BUY_COLOR = 'green-600'; // Strict color for Buy/Long
const SELL_COLOR = 'red-600';  // Strict color for Sell/Short

// --- Utility Components ---

const Sidebar = ({ isOpen, setIsOpen, setActiveSection }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
        { name: 'Trade', icon: Repeat2, section: 'trade' },
        { name: 'Swap', icon: Zap, section: 'swap' },
        { name: 'Liquidity', icon: Coins, section: 'liquidity' },
        { name: 'Wallet', icon: Wallet, section: 'wallet' },
        { name: 'History', icon: History, section: 'history' },
        { name: 'Settings', icon: Settings, section: 'settings' },
    ];

    const sidebarClass = isOpen
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0';

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${sidebarClass} lg:static lg:flex lg:flex-col lg:z-auto`}>
                <div className="p-4 text-3xl font-black border-b border-gray-700/50 flex justify-between items-center">
                    <span className={`text-${PRIMARY_COLOR}`}>Afro</span>Dex
                    <button className="lg:hidden p-1 text-gray-300" onClick={() => setIsOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActiveSection(item.section); setIsOpen(false); }}
                            className={`flex items-center p-3 rounded-lg transition duration-150 ${
                                item.section === 'trade' // Assuming 'trade' is the default active view here
                                    ? `bg-${PRIMARY_COLOR_HOVER} text-gray-900 font-bold shadow-lg`
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </a>
                    ))}
                </nav>
            </div>
        </>
    );
};

// --- Market List Component ---

const MarketList = ({ markets, currentPair, setCurrentPair }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMarkets = markets.filter(market =>
        `${market.base}/${market.quote}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: price.includes('.') ? price.split('.')[1].length : 2
        });
    };

    return (
        <div className="bg-gray-900 text-gray-100 flex flex-col h-full rounded-lg shadow-xl overflow-hidden">
            <div className="p-3 border-b border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search markets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            <div className="flex text-xs font-medium text-gray-400 border-b border-gray-700 px-3 py-2 uppercase">
                <span className="w-1/4">Pair</span>
                <span className="w-1/4 text-right">Price</span>
                <span className="w-1/4 text-right">Change (24h)</span>
                <span className="w-1/4 text-right hidden md:block">Volume</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredMarkets.length > 0 ? (
                    filteredMarkets.map((market, index) => {
                        const isCurrent = market.base === currentPair.base && market.quote === currentPair.quote;
                        const isPositive = market.change >= 0;
                        const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

                        return (
                            <div
                                key={index}
                                className={`flex items-center text-sm font-medium cursor-pointer transition duration-150 p-3 hover:bg-gray-800 ${isCurrent ? `bg-gray-800 border-l-4 border-${PRIMARY_COLOR}` : ''}`}
                                onClick={() => setCurrentPair(market)}
                            >
                                <span className="w-1/4 text-white">{market.base}/<span className="text-gray-400">{market.quote}</span></span>
                                <span className="w-1/4 text-right text-white">{formatPrice(market.price)}</span>
                                <span className={`w-1/4 text-right ${changeColor}`}>{isPositive ? '+' : ''}{market.change.toFixed(2)}%</span>
                                <span className="w-1/4 text-right text-gray-400 text-xs hidden md:block">{market.volume.toLocaleString()}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 text-center text-gray-500">No markets found.</div>
                )}
            </div>
        </div>
    );
};

// --- Order Book Component ---

const OrderBook = ({ currentPair }) => {
    // Mock data for Order Book
    const mockBids = useMemo(() => [
        { price: 3849.50, amount: 0.5, total: 1924.75 },
        { price: 3849.40, amount: 1.2, total: 4619.28 },
        { price: 3849.30, amount: 2.1, total: 8083.53 },
        { price: 3849.20, amount: 0.8, total: 3079.36 },
        { price: 3849.10, amount: 3.5, total: 13471.85 },
    ], []);
    const mockAsks = useMemo(() => [
        { price: 3850.50, amount: 1.0, total: 3850.50 },
        { price: 3850.60, amount: 0.7, total: 2695.42 },
        { price: 3850.70, amount: 1.5, total: 5776.05 },
        { price: 3850.80, amount: 2.3, total: 8856.84 },
        { price: 3850.90, amount: 0.4, total: 1540.36 },
    ], []);

    const [decimalPlaces, setDecimalPlaces] = useState(2); // For price aggregation

    const formatValue = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });

    const maxTotal = Math.max(
        ...mockBids.map(b => b.total),
        ...mockAsks.map(a => a.total)
    );

    return (
        <div className="bg-gray-900 text-gray-100 flex flex-col h-full rounded-lg shadow-xl overflow-hidden">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Order Book</h3>
                <div className="flex items-center text-xs space-x-2">
                    <span className="text-gray-400">Group:</span>
                    <button className={`p-1 rounded text-gray-400 bg-gray-800 hover:bg-gray-700 transition`}>
                        {decimalPlaces} Decimals <ChevronDown className="w-3 h-3 inline ml-1" />
                    </button>
                    <Clock className="w-4 h-4 text-gray-500" />
                </div>
            </div>

            <div className="flex text-xs font-medium text-gray-400 border-b border-gray-700 px-3 py-2 uppercase">
                <span className="w-1/3 text-left">Price ({currentPair.quote})</span>
                <span className="w-1/3 text-right">Amount ({currentPair.base})</span>
                <span className="w-1/3 text-right">Total ({currentPair.quote})</span>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Asks (Sells) */}
                <div className="flex-1 overflow-y-auto order-book-asks">
                    {mockAsks.slice().reverse().map((order, index) => (
                        <div
                            key={`ask-${index}`}
                            className="flex text-sm p-1.5 font-mono relative cursor-pointer hover:bg-red-900/20 transition"
                        >
                            {/* Visual depth bar - red for sells */}
                            <div className="absolute inset-y-0 right-0 bg-red-600/10" style={{ width: `${(order.total / maxTotal) * 100}%` }}></div>
                            
                            <span className={`w-1/3 text-left text-${SELL_COLOR} z-10`}>{formatValue(order.price)}</span>
                            <span className="w-1/3 text-right text-gray-300 z-10">{formatValue(order.amount)}</span>
                            <span className="w-1/3 text-right text-gray-400 text-xs z-10">{formatValue(order.total)}</span>
                        </div>
                    ))}
                </div>

                {/* Last Trade Price */}
                <div className="p-2 bg-gray-800 text-center font-bold text-xl cursor-default transition duration-300">
                    <span className={`text-${PRIMARY_COLOR}`}>{formatValue(3850.00)}</span>
                    <span className="text-sm text-gray-500 ml-2">({currentPair.quote})</span>
                </div>

                {/* Bids (Buys) */}
                <div className="flex-1 overflow-y-auto order-book-bids">
                    {mockBids.map((order, index) => (
                        <div
                            key={`bid-${index}`}
                            className="flex text-sm p-1.5 font-mono relative cursor-pointer hover:bg-green-900/20 transition"
                        >
                            {/* Visual depth bar - green for buys */}
                            <div className="absolute inset-y-0 right-0 bg-green-600/10" style={{ width: `${(order.total / maxTotal) * 100}%` }}></div>
                            
                            <span className={`w-1/3 text-left text-${BUY_COLOR} z-10`}>{formatValue(order.price)}</span>
                            <span className="w-1/3 text-right text-gray-300 z-10">{formatValue(order.amount)}</span>
                            <span className="w-1/3 text-right text-gray-400 text-xs z-10">{formatValue(order.total)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Trade Form Component (Simplified) ---

const TradeForm = ({ currentPair }) => {
    const [tradeType, setTradeType] = useState('Limit'); // Limit or Market
    const [side, setSide] = useState('Buy'); // Buy or Sell

    const buttonClass = (currentSide) => {
        const baseClasses = "flex-1 py-3 text-lg font-bold transition duration-200 rounded-lg";
        if (currentSide === 'Buy') {
            return side === 'Buy'
                ? `bg-${BUY_COLOR} text-white shadow-xl shadow-green-900/30`
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700';
        } else {
            return side === 'Sell'
                ? `bg-${SELL_COLOR} text-white shadow-xl shadow-red-900/30`
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700';
        }
    };

    const inputStyle = "w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500";

    return (
        <div className="bg-gray-900 text-gray-100 flex flex-col p-4 rounded-lg shadow-xl">
            {/* Buy/Sell Toggles */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setSide('Buy')}
                    className={buttonClass('Buy')}
                >
                    Buy {currentPair.base}
                </button>
                <button
                    onClick={() => setSide('Sell')}
                    className={buttonClass('Sell')}
                >
                    Sell {currentPair.base}
                </button>
            </div>

            {/* Limit/Market Toggles */}
            <div className="flex space-x-2 mb-6 text-sm">
                {['Limit', 'Market', 'Stop Limit'].map(type => (
                    <button
                        key={type}
                        onClick={() => setTradeType(type)}
                        className={`py-1 px-3 rounded-full transition duration-150 ${
                            tradeType === type
                                ? `bg-${PRIMARY_COLOR} text-gray-900 font-semibold`
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Trade Inputs */}
            <div className="space-y-4">
                {tradeType !== 'Market' && (
                    <div className="relative">
                        <label className="text-xs text-gray-400 block mb-1">Price ({currentPair.quote})</label>
                        <input type="number" placeholder="0.00" defaultValue="3850.00" className={inputStyle} />
                        <span className="absolute right-3 top-9 text-gray-500 text-sm">MAX</span>
                    </div>
                )}
                
                <div className="relative">
                    <label className="text-xs text-gray-400 block mb-1">Amount ({currentPair.base})</label>
                    <input type="number" placeholder="0.00" className={inputStyle} />
                    <span className="absolute right-3 top-9 text-gray-500 text-sm">MAX</span>
                </div>
                
                <div className="relative">
                    <label className="text-xs text-gray-400 block mb-1">Total ({currentPair.quote})</label>
                    <input type="number" placeholder="0.00" className={inputStyle} />
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400 mt-4 border-t border-gray-800 pt-3">
                <span>Available:</span>
                <span className="font-medium">12.345 {currentPair.quote}</span>
            </div>

            <button
                className={`w-full mt-6 py-3 text-lg font-extrabold text-white rounded-lg transition duration-200 ${
                    side === 'Buy' ? `bg-${BUY_COLOR} hover:bg-green-700` : `bg-${SELL_COLOR} hover:bg-red-700`
                }`}
            >
                {side} {currentPair.base}
            </button>
        </div>
    );
};

// --- Main Trading View Component ---

const TradingView = ({ currentPair }) => {
    // Mock Price Data
    const isPositive = currentPair.change >= 0;
    const priceColor = isPositive ? 'text-green-500' : 'text-red-500';
    const arrowIcon = isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
    
    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: price.includes('.') ? price.split('.')[1].length : 2
        });
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header / Ticker Bar */}
            <div className="bg-gray-900 p-4 rounded-lg shadow-xl flex flex-wrap items-center justify-between border-b border-gray-800">
                <div className="flex items-center space-x-4">
                    <h2 className="text-3xl font-extrabold text-white">{currentPair.base}/{currentPair.quote}</h2>
                    <div className="flex flex-col">
                        <span className={`text-4xl font-extrabold ${priceColor} flex items-center`}>
                            {formatPrice(currentPair.price)}
                        </span>
                        <span className="text-sm text-gray-500">Last Price ({currentPair.quote})</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6 text-sm font-medium text-gray-400 mt-4 lg:mt-0">
                    <div>
                        <span className="block text-xs uppercase">24h Change</span>
                        <span className={`flex items-center ${priceColor} font-bold`}>
                            {arrowIcon} {currentPair.change.toFixed(2)}%
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase">24h High</span>
                        <span className="text-white font-bold">4000.00</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase">24h Low</span>
                        <span className="text-white font-bold">3750.50</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase">24h Volume ({currentPair.base})</span>
                        <span className="text-white font-bold">{currentPair.volume.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="bg-gray-900 flex-1 rounded-lg shadow-xl flex items-center justify-center p-4">
                <BarChart className={`w-16 h-16 text-${PRIMARY_COLOR}/50`} />
                <span className="text-gray-600 text-lg ml-3">Chart Placeholder (Powered by TradingView)</span>
            </div>

            {/* Open Orders / Trade History */}
            <div className="bg-gray-900 p-4 rounded-lg shadow-xl">
                <div className="flex space-x-4 border-b border-gray-700 mb-3">
                    {['Open Orders (0)', 'Trade History', 'Fills'].map(tab => (
                        <button
                            key={tab}
                            className={`pb-2 text-sm font-semibold transition duration-150 ${
                                tab === 'Open Orders (0)' 
                                    ? `text-${PRIMARY_COLOR} border-b-2 border-${PRIMARY_COLOR}` 
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="text-center text-gray-500 py-6 text-sm">
                    No recent orders or trades for {currentPair.base}/{currentPair.quote}.
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('trade'); // Default to 'trade'
    const [currentPair, setCurrentPair] = useState(ALL_MARKETS.find(m => m.base === 'ETH' && m.quote === 'USDT') || ALL_MARKETS[0]);

    if (activeSection !== 'trade') {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex antialiased">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} setActiveSection={setActiveSection} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white shadow-sm p-4 lg:p-6 flex justify-between items-center border-b border-gray-200">
                        <button
                            className="text-gray-600 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-extrabold text-gray-800 capitalize">{activeSection}</h1>
                        <div className="flex items-center space-x-3">
                            <button className={`text-sm font-medium bg-${PRIMARY_COLOR} text-gray-900 px-4 py-2 rounded-full shadow-md hover:bg-${PRIMARY_COLOR_HOVER} transition duration-150`}>
                                Connect Wallet
                            </button>
                            <div className={`w-10 h-10 bg-${PRIMARY_COLOR} rounded-full flex items-center justify-center text-gray-900 font-bold text-lg`}>
                                EA
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-400">
                            <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeSection} View</h2>
                            <p className="text-gray-500 mt-1">Placeholder content for the {activeSection} section.</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 font-sans flex antialiased text-gray-100">
            <style jsx global>{`
                /* Custom styles for Tailwind's JIT mode, ensuring colors are included */
                .bg-amber-500 { background-color: #f59e0b; }
                .text-amber-500 { color: #f59e0b; }
                .hover\\:bg-amber-600:hover { background-color: #d97706; }
                .border-amber-500 { border-color: #f59e0b; }
                .bg-green-600 { background-color: #059669; }
                .hover\\:bg-green-700:hover { background-color: #047857; }
                .text-green-600 { color: #059669; }
                .bg-red-600 { background-color: #dc2626; }
                .hover\\:bg-red-700:hover { background-color: #b91c1c; }
                .text-red-600 { color: #dc2626; }

                /* Custom scrollbar styling for the dark theme */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937; /* gray-800 */
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4b5563; /* gray-600 */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6b7280; /* gray-500 */
                }
            `}</style>
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} setActiveSection={setActiveSection} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header/Nav */}
                <header className="bg-gray-900 shadow-xl p-3 flex justify-between items-center border-b border-gray-800 lg:hidden">
                    <button
                        className="text-gray-300 p-2 rounded-lg hover:bg-gray-800 transition"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">
                        <span className={`text-${PRIMARY_COLOR}`}>Afro</span>Dex
                    </h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-400 hidden sm:inline">{currentPair.base}/{currentPair.quote}</span>
                        <button className={`text-sm font-medium bg-${PRIMARY_COLOR} text-gray-900 px-3 py-1.5 rounded-full hover:bg-${PRIMARY_COLOR_HOVER}`}>
                            Wallet
                        </button>
                    </div>
                </header>

                {/* Main Grid Layout */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 lg:p-4">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 h-full">

                        {/* Markets List (Col 1: 3/12 wide) */}
                        <div className="col-span-full md:col-span-4 lg:col-span-3 h-[400px] md:h-full order-1">
                            <MarketList 
                                markets={ALL_MARKETS} 
                                currentPair={currentPair} 
                                setCurrentPair={setCurrentPair} 
                            />
                        </div>

                        {/* Trading View (Col 2: 6/12 wide) */}
                        <div className="col-span-full md:col-span-8 lg:col-span-6 h-full order-2 flex flex-col">
                            <TradingView currentPair={currentPair} />
                        </div>

                        {/* Order Book & Trade Form (Col 3: 3/12 wide) */}
                        <div className="col-span-full lg:col-span-3 h-full flex flex-col space-y-3 lg:space-y-4 order-3">
                            <div className="flex-1 min-h-[300px]">
                                <OrderBook currentPair={currentPair} />
                            </div>
                            <TradeForm currentPair={currentPair} />
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
