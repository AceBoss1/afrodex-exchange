"use client";
import { useState, useEffect, type ReactNode, useCallback, useMemo } from 'react';
// FIX: Aliased 'Home' icon to 'HomeIcon' to prevent collision with the exported function.
import { LogOut, Menu, X, Coins, BookOpen, FileText, HelpCircle, User, Zap, Activity, Clock, Layers, Maximize, Home as HomeIcon, type Icon as LucideIcon } from "lucide-react";

// --- FIREBASE IMPORTS ---
// IMPORTANT: These are dynamically provided global variables in the execution environment.
// We must check if they exist before parsing/using them.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;

// Only attempt to load Firebase modules if the config is available to prevent runtime errors
let initializeApp: any;
let getAuth: any;
let signInAnonymously: any;
let signInWithCustomToken: any;
let getFirestore: any;
let collection: any;
let doc: any;
let query: any;
let where: any;
let onSnapshot: any;
let setDoc: any;

try {
  const firebaseAppModule = require('firebase/app');
  initializeApp = firebaseAppModule.initializeApp;

  const firebaseAuthModule = require('firebase/auth');
  getAuth = firebaseAuthModule.getAuth;
  signInAnonymously = firebaseAuthModule.signInAnonymously;
  signInWithCustomToken = firebaseAuthModule.signInWithCustomToken;
  
  const firebaseFirestoreModule = require('firebase/firestore');
  getFirestore = firebaseFirestoreModule.getFirestore;
  collection = firebaseFirestoreModule.collection;
  doc = firebaseFirestoreModule.doc;
  query = firebaseFirestoreModule.query;
  where = firebaseFirestoreModule.where;
  onSnapshot = firebaseFirestoreModule.onSnapshot;
  setDoc = firebaseFirestoreModule.setDoc;

} catch (e) {
  console.error("Firebase module import error. This is expected if running outside the Canvas environment.", e);
}


// --- DATA TYPES ---
interface Trade {
  id: string;
  pair: string;
  type: 'Buy' | 'Sell';
  price: number;
  amount: number;
  time: number;
}

interface UserWallet {
  token: string;
  balance: number;
}

interface MenuItem {
    title: string;
    icon: LucideIcon;
    path: string;
}


// --- MAIN APP COMPONENT ---
// RENAMED from 'Home' to 'DEXApp' to eliminate the conflict with the imported Lucide icon.
export default function DEXApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Trade');
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [dbInstance, setDbInstance] = useState<any>(null);
  const [authInstance, setAuthInstance] = useState<any>(null);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [userWallets, setUserWallets] = useState<UserWallet[]>([
    { token: 'AFRO', balance: 5000.00 },
    { token: 'USD', balance: 10000.00 },
  ]);
  const [tradeForm, setTradeForm] = useState({
      pair: 'AFRO/USD',
      type: 'Buy',
      price: 1.5,
      amount: 100,
  });


  // 1. FIREBASE INITIALIZATION & AUTHENTICATION
  useEffect(() => {
    if (!firebaseConfig) {
      console.error("Firebase config is missing. Data persistence is disabled.");
      setAuthReady(true);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);
      setDbInstance(db);
      setAuthInstance(auth);

      const authenticate = async () => {
        const initialAuthToken = (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);
        
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        
        const currentUserId = auth.currentUser?.uid || crypto.randomUUID();
        setUserId(currentUserId);
        setAuthReady(true);
        console.log("Firebase initialized. User ID:", currentUserId);
      };

      authenticate();
    } catch (error) {
      console.error("Firebase Initialization Error:", error);
      setAuthReady(true); // Still set to true to unblock UI
    }
  }, []);

  // 2. FIRESTORE REAL-TIME DATA LISTENER (Recent Trades - Public Data)
  useEffect(() => {
    if (!authReady || !dbInstance) return;

    const tradesPath = `artifacts/${appId}/public/data/trades`;
    const q = query(collection(dbInstance, tradesPath));

    // Listen for real-time updates on trades
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
        const tradesData: Trade[] = [];
        snapshot.forEach((doc: any) => {
            const data = doc.data();
            tradesData.push({ 
                id: doc.id,
                pair: data.pair,
                type: data.type,
                price: data.price,
                amount: data.amount,
                time: data.time 
            });
        });
        // Sort by time descending and only keep the last 20
        tradesData.sort((a, b) => b.time - a.time);
        setRecentTrades(tradesData.slice(0, 20));
        console.log("Fetched trades:", tradesData.length);
    }, (error: any) => {
        console.error("Error fetching trades:", error);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [authReady, dbInstance]);


  // --- NAVIGATION DATA ---
  const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: HomeIcon, path: 'Dashboard' },
    { title: 'Trade', icon: Coins, path: 'Trade' },
    { title: 'Activity', icon: Activity, path: 'Activity' },
    { title: 'Docs', icon: BookOpen, path: 'Docs' },
    { title: 'Support', icon: HelpCircle, path: 'Support' },
  ];

  // --- HANDLERS ---
  const handleTradeSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authReady || !dbInstance || !userId) {
        console.warn("App not ready or user not logged in.");
        return;
    }

    // 1. Client-side validation (simple checks)
    if (tradeForm.amount <= 0 || tradeForm.price <= 0) {
        // In a production app, use a modal or toast notification, not window.alert
        console.error("Amount and price must be greater than zero.");
        return;
    }

    // 2. Prepare new trade data
    const newTrade: Omit<Trade, 'id'> = {
        pair: tradeForm.pair,
        type: tradeForm.type as 'Buy' | 'Sell',
        price: tradeForm.price,
        amount: tradeForm.amount,
        time: Date.now(),
    };

    // 3. Update Firestore (Public data, trades collection)
    try {
        const tradesPath = `artifacts/${appId}/public/data/trades`;
        const tradeDocRef = doc(collection(dbInstance, tradesPath));
        
        await setDoc(tradeDocRef, newTrade);
        
        console.log(`Trade submitted successfully: ${newTrade.type} ${newTrade.amount} ${newTrade.pair}`);

        // Update local wallet state (Mock logic)
        setUserWallets(prev => {
            const newWallets = [...prev];
            const baseToken = tradeForm.pair.split('/')[0]; // AFRO
            const quoteToken = tradeForm.pair.split('/')[1]; // USD
            const cost = tradeForm.amount * tradeForm.price;

            const baseWalletIndex = newWallets.findIndex(w => w.token === baseToken);
            const quoteWalletIndex = newWallets.findIndex(w => w.token === quoteToken);

            if (baseWalletIndex !== -1 && quoteWalletIndex !== -1) {
                if (tradeForm.type === 'Buy') {
                    // Buying AFRO: AFRO balance increases, USD balance decreases
                    newWallets[baseWalletIndex].balance += tradeForm.amount;
                    newWallets[quoteWalletIndex].balance -= cost;
                } else {
                    // Selling AFRO: AFRO balance decreases, USD balance increases
                    newWallets[baseWalletIndex].balance -= tradeForm.amount;
                    newWallets[quoteWalletIndex].balance += cost;
                }
                // Ensure no negative balances for mock state
                newWallets.forEach(w => w.balance = Math.max(0, w.balance));
            }
            return newWallets;
        });

    } catch (error) {
        console.error("Error submitting trade:", error);
    }
  }, [authReady, dbInstance, userId, tradeForm]);


  // --- UI COMPONENTS ---

  const Header = () => (
    <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700/50 shadow-md sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <button 
          className="lg:hidden text-white p-2 rounded-full hover:bg-gray-700/50 transition"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-green-400">AfroDex</span>
        <div className="hidden lg:flex space-x-2 text-sm">
            {menuItems.map(item => (
                <button
                    key={item.path}
                    onClick={() => setActiveTab(item.path)}
                    className={`flex items-center px-3 py-2 rounded-lg transition ${
                        activeTab === item.path 
                        ? 'bg-green-600/30 text-green-400 border border-green-500' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <item.icon className="w-4 h-4 mr-1"/>
                    {item.title}
                </button>
            ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block text-sm text-gray-400">
            {authReady ? (
                <span>User ID: <span className="text-green-400 font-mono text-xs">{userId || 'N/A'}</span></span>
            ) : (
                <span className="text-yellow-500">Connecting...</span>
            )}
        </div>
        <button 
          className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full transition text-sm"
          onClick={() => console.log('Logout action initiated')} // Placeholder for actual logout
        >
          <LogOut className="w-4 h-4 mr-1"/>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );

  const MobileMenu = () => (
    <div className={`fixed inset-0 z-20 bg-gray-900 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center border-b pb-4 border-gray-700">
          <span className="text-xl font-bold text-green-400">AfroDex</span>
          <button onClick={() => setIsMenuOpen(false)} className="text-white p-2 rounded-full hover:bg-gray-700 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-8 flex flex-col space-y-2">
            {menuItems.map(item => (
                <button
                    key={item.path}
                    onClick={() => { setActiveTab(item.path); setIsMenuOpen(false); }}
                    className={`flex items-center text-lg px-4 py-3 rounded-xl transition text-left ${
                        activeTab === item.path 
                        ? 'bg-green-600/30 text-green-400 font-semibold' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                    <item.icon className="w-5 h-5 mr-3"/>
                    {item.title}
                </button>
            ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-500">
            <p>Version 1.0 - Dedicated to the future of African DeFi.</p>
        </div>
      </div>
    </div>
  );

  const WalletSummary = () => (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700/50">
      <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-3 border-b border-gray-700 pb-2">
          <User className="w-5 h-5 mr-2 text-green-400"/> Your Wallet
      </h3>
      <div className="space-y-2">
        {userWallets.map(wallet => (
          <div key={wallet.token} className="flex justify-between text-gray-300">
            <span className="font-medium">{wallet.token} Balance:</span>
            <span className="font-mono text-green-300 text-right">
              {wallet.balance.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
          Deposit/Withdraw
      </button>
    </div>
  );

  const TradeForm = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-green-500/50">
      <h3 className="text-xl font-bold text-green-400 mb-5 flex items-center">
        <Coins className="w-6 h-6 mr-2"/> Execute Trade
      </h3>
      <form onSubmit={handleTradeSubmit} className="space-y-5">
        
        {/* Trading Pair Selector */}
        <div>
          <label htmlFor="pair" className="block text-sm font-medium text-gray-300 mb-1">Trading Pair</label>
          <select
            id="pair"
            value={tradeForm.pair}
            onChange={(e) => setTradeForm({ ...tradeForm, pair: e.target.value })}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-green-500 focus:border-green-500 appearance-none"
          >
            <option value="AFRO/USD">AFRO/USD</option>
            <option value="AFRO/BTC">AFRO/BTC</option>
            <option value="USD/BTC">USD/BTC</option>
          </select>
        </div>

        {/* Trade Type (Buy/Sell) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Trade Type</label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setTradeForm({ ...tradeForm, type: 'Buy' })}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                tradeForm.type === 'Buy' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Buy AFRO
            </button>
            <button
              type="button"
              onClick={() => setTradeForm({ ...tradeForm, type: 'Sell' })}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                tradeForm.type === 'Sell' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sell AFRO
            </button>
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price (USD)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={tradeForm.price}
            onChange={(e) => setTradeForm({ ...tradeForm, price: parseFloat(e.target.value) })}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
            placeholder="Limit Price"
            required
          />
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (AFRO)</label>
          <input
            id="amount"
            type="number"
            step="any"
            value={tradeForm.amount}
            onChange={(e) => setTradeForm({ ...tradeForm, amount: parseFloat(e.target.value) })}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
            placeholder="Quantity"
            required
          />
        </div>
        
        {/* Cost/Value Summary */}
        <div className="text-sm pt-2">
            <p className="text-gray-400 flex justify-between">
                <span>Total Cost ({tradeForm.pair.split('/')[1]}):</span>
                <span className="font-semibold text-green-300">{(tradeForm.price * tradeForm.amount).toFixed(2)}</span>
            </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            tradeForm.type === 'Buy' 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
          } text-white shadow-md`}
          disabled={!authReady}
        >
          {authReady ? `${tradeForm.type} ${tradeForm.pair.split('/')[0]}` : 'Connecting...'}
        </button>
      </form>
    </div>
  );

  const RecentTrades = () => (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700/50 h-full overflow-hidden flex flex-col">
      <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-3 border-b border-gray-700 pb-2">
        <Clock className="w-5 h-5 mr-2 text-green-400"/> Recent Trades (AFRO/USD)
      </h3>
      
      {/* Table Header */}
      <div className="flex text-xs font-semibold text-gray-400 uppercase pb-2 border-b border-gray-700">
        <span className="w-1/4">Type</span>
        <span className="w-1/4 text-right">Price</span>
        <span className="w-1/4 text-right">Amount</span>
        <span className="w-1/4 text-right hidden sm:block">Time</span>
      </div>

      {/* Trade List */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {recentTrades.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">No recent trades found.</p>
        ) : (
            recentTrades.map((trade) => (
                <div 
                    key={trade.id} 
                    className="flex text-sm py-2 border-b border-gray-800 hover:bg-gray-700 transition"
                >
                    <span className={`w-1/4 font-medium ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.type}
                    </span>
                    <span className="w-1/4 text-right text-white">
                        {trade.price.toFixed(4)}
                    </span>
                    <span className="w-1/4 text-right text-gray-300">
                        {trade.amount.toFixed(2)}
                    </span>
                    <span className="w-1/4 text-right text-gray-500 text-xs self-center hidden sm:block">
                        {new Date(trade.time).toLocaleTimeString()}
                    </span>
                </div>
            ))
        )}
      </div>
    </div>
  );


  // --- RENDER LOGIC ---
  
  if (activeTab !== 'Trade') {
      return (
          <div className="min-h-screen bg-gray-900 text-white flex flex-col">
              <Header />
              <MobileMenu />
              <main className="p-4 lg:p-8 flex-grow">
                  <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 max-w-4xl mx-auto">
                      <h2 className="text-2xl font-bold text-green-400 mb-4">{activeTab}</h2>
                      <p className="text-gray-300">
                          This is the content area for the **{activeTab}** section. In a full application, this would contain detailed charts, order books, and historical data. For now, please navigate back to the **Trade** tab.
                      </p>
                      <button 
                          onClick={() => setActiveTab('Trade')}
                          className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition font-medium"
                      >
                          Go to Trade Interface
                      </button>
                  </div>
              </main>
          </div>
      );
  }

  // Main Trade Dashboard
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937; /* gray-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151; /* gray-700 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563; /* gray-600 */
        }
      `}</style>
      
      <Header />
      <MobileMenu />

      <main className="flex-grow p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          
          {/* Column 1: Trading View (Placeholder) */}
          <div className="lg:col-span-2 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700/50 aspect-video lg:aspect-auto">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-gray-200 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-green-400"/> Chart View (AFRO/USD)
                </h2>
                <button className="text-gray-400 hover:text-green-400 transition hidden sm:block">
                    <Maximize className="w-5 h-5"/>
                </button>
            </div>
            {/* Placeholder for TradingView or Chart Library */}
            <div className="flex items-center justify-center h-48 lg:h-[calc(100%-40px)] bg-gray-900 rounded-lg border border-dashed border-gray-700">
              <span className="text-gray-500 text-center p-4">
                  [Placeholder for Real-time Chart Data / TradingView Widget]
                  <br/>Data updates are simulated on trade execution.
              </span>
            </div>
          </div>
          
          {/* Column 2: Trade Form & Wallet */}
          <div className="lg:col-span-1 space-y-6">
            <TradeForm />
            <WalletSummary />
          </div>

          {/* Column 3: Order Book & Recent Trades */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            {/* Order Book Placeholder */}
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700/50 flex-1">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-3 border-b border-gray-700 pb-2">
                    <Activity className="w-5 h-5 mr-2 text-green-400"/> Order Book
                </h3>
                <div className="h-full flex items-center justify-center text-gray-500">
                    [Placeholder for Buy/Sell Orders]
                </div>
            </div>
            
            {/* Recent Trades */}
            <div className="flex-1 min-h-[250px] lg:min-h-0"> 
                <RecentTrades />
            </div>

          </div>
        </div>
      </main>
      
      <footer className="p-3 text-center text-xs text-gray-500 border-t border-gray-800">
        &copy; {new Date().getFullYear()} AfroDex. Built for the African Decentralized Finance Community.
      </footer>
    </div>
  );
}
