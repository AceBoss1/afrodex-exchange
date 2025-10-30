/**
 * AfroDex Exchange Configuration File
 *
 * This file centralizes the contract addresses, ABIs, and network settings
 * required for the AfroDex front-end to communicate with the
 * deployed AfroDex Exchange Smart Contract.
 *
 * ACTION REQUIRED: PLEASE REPLACE ALL [PLACEHOLDERS] BELOW.
 */

// ---------------------------------------------------------------------
// 1. NETWORK & CONTRACT ADDRESSES
// ---------------------------------------------------------------------

// The network ID the AfroDex contract is deployed on.
// 1: Ethereum Mainnet
const AFRODEX_NETWORK_ID = 1; // CONFIRMED: Ethereum Mainnet

// The deployed address of your AfroDex Exchange Smart Contract.
// INSERT YOUR DEPLOYED EXCHANGE ADDRESS HERE
const AFRODEX_EXCHANGE_ADDRESS = '0xE8FfF15bB5E14095bFdfA8Bb85D83cC900c23C56';

// ---------------------------------------------------------------------
// 2. TOKEN LIST
// ---------------------------------------------------------------------

// The front-end needs a list of tokens to display in the dropdowns.
// Replace the dummy tokens with your project's main tokens.
// IMPORTANT: Adjust the 'decimals' property to match the contract.
const AFRODEX_TOKENS = [
    {
        name: 'ETH',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000' // ETH is always the zero address
    },
    {
        name: 'Wrapped ETH',
        symbol: 'WETH',
        address: '0xC02aaA39b223FE8D0A0e5C4F27EAD9083C756Cc2' // INSERT WETH ADDRESS ON MAINNET
    },
    {
        name: 'AfroDex',
        symbol: 'AfroX',
        address: '0x08130635368aa28b217a4dfb68e1bf8dc525621c' // INSERT AFROdex COIN ADDRESS
    },
     {
        name: 'AfroDex Labs Token',
        symbol: 'AFDLT',
        address: '0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50' // INSERT TOKEN ADDRESS
    },
    {
        name: 'FARM DeFi',
        symbol: 'PFARM',
        address: '0x6a8C66Cab4F766E5E30b4e9445582094303cc322' // INSERT TOKEN ADDRESS
    },
    {
        name: 'PLAAS FARMERS TOKEN',
        symbol: 'PLAAS',
        address: '0x60571E95E12c78CbA5223042692908f0649435a5' // INSERT TOKEN ADDRESS
    },
    {
        name: 'Travel1Click',
        symbol: 'T1C',
        address: '0xa7C71d444bf9aF4bfEd2adE75595d7512Eb4DD39' // INSERT TOKEN ADDRESS
    },
    {
        name: '1ClickToken',
        symbol: '1CT',
        address: '0x8cB40391A52412127232747294f737B7882fC873' // INSERT TOKEN ADDRESS
    },
    {
        name: 'Free Coin',
        symbol: 'FREE',
        address: '0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd' // INSERT TOKEN ADDRESS
    },
    {
        name: 'Living Without Borders Token',
        symbol: 'LWBT',
        address: '0xA03c34eE9fA0e8db36Dd9bF8D46631Bb25F66302' // INSERT TOKEN ADDRESS
    },
    {
        name: 'Bitcratic',
        symbol: 'BCT',
        address: '0x9ec251401eafb7e98f37a1d911c0aea02cb63a80' // INSERT TOKEN ADDRESS
    },
    {
        name: 'Binance USD',
        symbol: 'BUSD',
        address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53' // INSERT STABLE TOKEN ADDRESS
    }, // Corrected: Added missing comma here
    {
        name: 'Tether USD',
        symbol: 'USDT',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' // INSERT STABLE TOKEN ADDRESS
    }
];

// ---------------------------------------------------------------------
// 3. CONTRACT ABI (CRITICAL)
// ---------------------------------------------------------------------

// PASTE THE ENTIRE ABI ARRAY OF YOUR AFRODEX EXCHANGE CONTRACT HERE.
// This must be a single, valid JavaScript array of objects.
const AFRODEX_EXCHANGE_ABI = [{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"trade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"order","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orderFills","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"cancelOrder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"depositToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"amountFilled","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeMake_","type":"uint256"}],"name":"changeFeeMake","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeMake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeRebate_","type":"uint256"}],"name":"changeFeeRebate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"sender","type":"address"}],"name":"testTrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeAccount_","type":"address"}],"name":"changeFeeAccount","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeRebate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeTake_","type":"uint256"}],"name":"changeFeeTake","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"admin_","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeTake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"accountLevelsAddr_","type":"address"}],"name":"changeAccountLevelsAddr","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"accountLevelsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"availableVolume","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"admin_","type":"address"},{"name":"feeAccount_","type":"address"},{"name":"accountLevelsAddr_","type":"address"},{"name":"feeMake_","type":"uint256"},{"name":"feeTake_","type":"uint256"},{"name":"feeRebate_","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"user","type":"address"}],"name":"Order","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"v","type":"uint8"},{"indexed":false,"name":"r","type":"bytes32"},{"indexed":false,"name":"s","type":"bytes32"}],"name":"Cancel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"get","type":"address"},{"indexed":false,"name":"give","type":"address"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Withdraw","type":"event"}];

// Export the constants so they can be accessed by the main application script
window.AFRODEX_CONFIG = {
    NETWORK_ID: AFRODEX_NETWORK_ID,
    EXCHANGE_ADDRESS: AFRODEX_EXCHANGE_ADDRESS,
    EXCHANGE_ABI: AFRODEX_EXCHANGE_ABI,
    TOKENS: AFRODEX_TOKENS
};
