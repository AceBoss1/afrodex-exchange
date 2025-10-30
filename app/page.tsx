import { useState, useEffect, type ReactNode, type FC } from 'react';
import { LogOut, Menu, X, Home, Coins, BookOpen, FileText, HelpCircle, type Icon as LucideIcon } from "lucide-react";

// -----------------------------------------------------------
// 1. INTERFACES (Typescript Setup)
// -----------------------------------------------------------

// Defines the shape of the theme classes for type safety
interface ThemeClasses {
    primary: string;
    background: string;
    surface: string;
    surface_light: string;
    border: string;
    text: string;
    text_secondary: string;
    success: string;
    error: string;
}

// Interfaces for the Header Component
interface WalletConnectProps {
    onConnect: () => void;
    themeClasses: ThemeClasses;
}

interface HeaderProps {
    isConnected: boolean;
    userAddress: string;
    onDisconnect: () => void;
    onConnect: () => void;
    themeClasses: ThemeClasses;
}

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

// Interfaces for the Layout Component
interface LayoutProps {
    children: ReactNode;
}

// -----------------------------------------------------------
// 2. CONSTANTS & UTILS
// -----------------------------------------------------------

// Utility function for conditional classes
const cn = (...classes: (string | boolean | undefined)[]): string => classes.filter(Boolean).join(' ');

// Custom Tailwind-style classes mimicking the dark theme
const themeClasses: ThemeClasses = {
    'primary': 'text-orange-400', 
    'background': 'bg-gray-950', 
    'surface': 'bg-gray-900', 
    'surface_light': 'bg-gray-800', 
    'border': 'border-gray-700', 
    'text': 'text-gray-100', 
    'text_secondary': 'text-gray-400',
    'success': 'text-green-500',
    'error': 'text-red-500',
};

const navItems: NavItem[] = [
    { name: "Swap", href: "/", icon: Home },
    { name: "Markets", href: "/markets", icon: Coins },
    { name: "Orderbook", href: "/orderbook", icon: BookOpen },
    { name: "Smart Contract", href: "/contract", icon: FileText },
    { name: "Help", href: "/help", icon: HelpCircle },
];

// -----------------------------------------------------------
// 3. HEADER COMPONENT (components/header.tsx logic)
// -----------------------------------------------------------

const WalletConnect: FC<WalletConnectProps> = ({ onConnect, themeClasses }) => {
    return (
        <button
            onClick={onConnect}
            className={cn(
                "px-4 py-2 rounded-lg font-bold transition-colors duration-200",
                "bg-orange-400 text-gray-950 hover:bg-orange-500 shadow-lg",
                "text-sm sm:text-base whitespace-nowrap"
            )}
        >
            Connect Wallet
        </button>
    )
}

const Header: FC<HeaderProps> = ({ isConnected, userAddress, onDisconnect, onConnect, themeClasses }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const displayAddress = (address: string): string => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };
    
    const handleDisconnect = (): void => {
        onDisconnect();
        setIsMenuOpen(false);
    }

    return (
        <header className={cn(
            themeClasses.surface, 
            themeClasses.border,
            "border-b shadow-md sticky top-0 z-10", 
            isMenuOpen && "z-30"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center space-x-2">
                            <img 
                                src="/afrodex-logo.png" 
                                alt="AfroDEX Logo" 
                                className="h-10 w-auto rounded-md"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://placehold.co/150x40/000000/F97316?text=AfroDEX"; 
                                }}
                            />
                            <div> 
                                <h1 className={cn("text-xl font-bold leading-tight", themeClasses.primary)}>AfroDEX</h1>
                                <p className={cn("text-xs italic leading-tight hidden sm:block", themeClasses.text_secondary)}>...Africa's biggest DEX</p>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation & Wallet Button */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <nav className="flex space-x-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={cn("hover:text-primary transition-colors duration-200 font-medium p-2 rounded-md", themeClasses.text_secondary)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                        
                        <div className="ml-4 flex items-center">
                            {isConnected ? (
                                <div className={cn("flex items-center space-x-3 rounded-full p-1 border", themeClasses.surface_light, themeClasses.border)}>
                                    <span className="bg-green-700/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                                        {displayAddress(userAddress)}
                                    </span>
                                    <button 
                                        onClick={handleDisconnect}
                                        className="p-2 rounded-full text-red-500 hover:bg-red-900/20 transition-colors"
                                        title="Disconnect Wallet"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <WalletConnect onConnect={onConnect} themeClasses={themeClasses} />
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn("p-2 rounded-lg hover:bg-gray-800 transition-colors", themeClasses.text_secondary)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            <div 
                className={cn(
                    "lg:hidden absolute w-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-20 border-t",
                    themeClasses.surface, 
                    themeClasses.border,
                    isMenuOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors", 
                                    themeClasses.text_secondary, 
                                    "hover:bg-gray-800 hover:text-orange-400"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </a>
                        );
                    })}
                    
                    {/* Mobile Wallet Status */}
                    <div className="pt-4 border-t mt-4" style={{ borderColor: themeClasses.border.split('-').pop() }}>
                        {isConnected ? (
                            <div className="flex flex-col space-y-2 p-2">
                                <span className={cn("text-sm font-medium", themeClasses.text_secondary)}>
                                    Connected: <span className="text-green-500 font-semibold">{displayAddress(userAddress)}</span>
                                </span>
                                <button 
                                    onClick={handleDisconnect}
                                    className="flex items-center justify-center w-full px-3 py-3 border border-red-500 rounded-md text-red-500 text-base font-medium hover:bg-red-900/10 transition-colors mt-2"
                                >
                                    <LogOut className="h-5 w-5 mr-2" /> Disconnect
                                </button>
                            </div>
                        ) : (
                            <div className="p-2">
                                <WalletConnect onConnect={onConnect} themeClasses={themeClasses} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

// -----------------------------------------------------------
// 4. PAGE COMPONENT (app/page.tsx logic)
// -----------------------------------------------------------

// Placeholder for the main Swap Card component
const SwapCardPlaceholder: FC = () => (
    <div className="w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 space-y-4">
        <h4 className="text-xl font-semibold text-gray-100">Swap Interface</h4>
        <div className="min-h-[200px] flex items-center justify-center border border-dashed border-gray-600 rounded-lg p-6">
            <p className="text-gray-500 italic">
                [Swap Card Component would be rendered here]
            </p>
        </div>
        <button className="w-full py-3 bg-orange-400 text-gray-900 font-bold rounded-lg hover:bg-orange-500 transition">
            Start Swapping
        </button>
    </div>
);


const Page: FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">Seamless Decentralized Asset Exchange</h2>
            <p className="text-lg text-gray-400 mb-8">
                Trade crypto assets instantly and efficiently on AfroDEX.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex justify-center p-6 rounded-xl">
                    <SwapCardPlaceholder />
                </div>

                <div className="lg:col-span-1 p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 h-fit">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-800 pb-2">Market Overview</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex justify-between"><span>Total Liquidity:</span><span className="text-green-400 font-medium">$2.5M</span></li>
                        <li className="flex justify-between"><span>24h Volume:</span><span className="text-green-400 font-medium">$450K</span></li>
                        <li className="flex justify-between"><span>Top Pair:</span><span className="text-orange-400 font-medium">ETH / USDC</span></li>
                        <li className="flex justify-between"><span>Active Traders:</span><span className="font-medium">1,234</span></li>
                    </ul>
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                       <p className="text-xs text-gray-400">Trading involves risk. All prices are for informational purposes only.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


// -----------------------------------------------------------
// 5. ROOT LAYOUT COMPONENT (app/layout.tsx logic)
// -----------------------------------------------------------

export default function App() {
    // Global Wallet State Management (from layout.tsx)
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [userAddress, setUserAddress] = useState<string>(''); 

    useEffect(() => {
        // Mocking an initial connection check/restoration
        const storedAddress: string = "0x89d24A6b4CcB2EdB6bA4d9eE7de73e86f9cFD9bF"; 
        if (storedAddress) {
            setIsConnected(true);
            setUserAddress(storedAddress);
        }
    }, []);

    const handleDisconnect = (): void => {
        setIsConnected(false);
        setUserAddress('');
        console.log("Wallet disconnected.");
    };

    const handleConnect = (): void => {
        setIsConnected(true);
        setUserAddress('0xAfroA6b4CcB2EdB6bA4d9eE7de73e86f9cFD9bF'); 
        console.log("Wallet connected.");
    };

    return (
        <div className={cn(
            "min-h-screen antialiased font-sans", 
            themeClasses.background, 
            themeClasses.text,
        )}>
            
            {/* Header Component */}
            <Header 
                isConnected={isConnected} 
                userAddress={userAddress} 
                onDisconnect={handleDisconnect} 
                onConnect={handleConnect}
                themeClasses={themeClasses}
            />

            {/* Page Content */}
            <main className="flex-grow">
                <Page />
            </main>

            <footer className={cn("py-4 text-center text-xs border-t mt-12", themeClasses.text_secondary, themeClasses.border)}>
              &copy; 2019-Present AfroDEX - Pioneering the future of decentralized finance.
            </footer>
        </div>
    );
}

