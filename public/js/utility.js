/**
 * AfroDex Client Utility Functions (Order Hashing & Signing)
 *
 * This file contains the critical cryptographic functions required for the
 * off-chain order book model:
 * 1. Hashing the order data using keccak256 (MUST match the smart contract).
 * 2. Prompting the connected wallet (MetaMask) to sign the hash.
 *
 * NOTE: This requires the 'ethers.js' library to be loaded globally in the HTML.
 */

/**
 * Calculates the keccak256 hash of an order payload.
 * The types and order here MUST be identical to the packing logic in your smart contract
 * (tokenGet, amountGet, tokenGive, amountGive, expires, nonce, contractAddress).
 */
function hashOrder(
    tokenGet,
    amountGet,
    tokenGive,
    amountGive,
    expires,
    nonce,
    contractAddress
) {
    if (!window.ethers || !window.ethers.utils) {
        console.error("Ethers.js is not loaded. Cannot hash order.");
        // Return a dummy hash to prevent immediate crash, though subsequent signing will fail.
        return "0x0000000000000000000000000000000000000000000000000000000000000000";
    }

    // Use ethers.utils.solidityKeccak256 for deterministic hashing
    return window.ethers.utils.solidityKeccak256(
        ["address", "uint256", "address", "uint256", "uint256", "uint256", "address"],
        [tokenGet, amountGet, tokenGive, amountGive, expires, nonce, contractAddress]
    );
}

/**
 * Prompts the user's wallet (signer) to sign the calculated order hash.
 * @param {string} hash - The 32-byte keccak256 hash of the order.
 * @param {object} signer - The Ethers Signer object (from Web3Provider).
 * @returns {Promise<{v: number, r: string, s: string}>} The components of the signature.
 */
async function signOrder(hash, signer) {
    if (!signer) {
        throw new Error("Wallet not connected. Please connect MetaMask.");
    }

    try {
        // Signer signs the message corresponding to the hash
        const signature = await signer.signMessage(window.ethers.utils.arrayify(hash));
        
        // Split the signature into its v, r, and s components for the smart contract
        const splitSig = window.ethers.utils.splitSignature(signature);

        return {
            v: splitSig.v,
            r: splitSig.r,
            s: splitSig.s
        };

    } catch (error) {
        // Log the full error for debugging but provide a clean message to the user
        console.error("Order signing failed:", error);
        throw new Error("Order signing was rejected by the user or failed. Check console for details.");
    }
}

// Attach functions to the window object for global access in dapp_main.js
window.AfroDexUtils = {
    hashOrder,
    signOrder
};
