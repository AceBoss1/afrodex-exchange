import { useState } from 'react';
import { LogOut, Menu, X, Home, Coins, BookOpen, FileText, HelpCircle } from "lucide-react";

// Utility function for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Nav items configuration
const navItems = [
    { name: "Swap", href: "/", icon: Home },
    { name: "Markets", href: "/markets", icon: Coins },
    { name: "Orderbook", href: "/orderbook", icon: BookOpen },
    { name: "Smart Contract", href: "/contract", icon: FileText },
    { name: "Help", href: "/help", icon: HelpCircle },
];

// WalletConnect Component (Button only)
const WalletConnect = ({ onConnect }) => {
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

export default function Header({ isConnected, userAddress, onDisconnect, onConnect, themeClasses }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const displayAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const handleDisconnect = () => {
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
                                onError={(e) => {
                                    const target = e.target;
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
                                <WalletConnect onConnect={onConnect} />
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
                                <WalletConnect onConnect={onConnect} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
