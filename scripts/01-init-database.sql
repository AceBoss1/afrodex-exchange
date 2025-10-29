-- Create trades table to store transaction history
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  user_address VARCHAR(42) NOT NULL,
  token_in VARCHAR(100) NOT NULL,
  token_out VARCHAR(100) NOT NULL,
  amount_in DECIMAL(36, 18) NOT NULL,
  amount_out DECIMAL(36, 18) NOT NULL,
  transaction_hash VARCHAR(66) UNIQUE NOT NULL,
  block_number BIGINT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_address (user_address),
  INDEX idx_created_at (created_at)
);

-- Create users table to store user data
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  total_trades INT DEFAULT 0,
  total_volume DECIMAL(36, 18) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_wallet_address (wallet_address)
);

-- Create tokens table to store supported tokens
CREATE TABLE IF NOT EXISTS tokens (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  contract_address VARCHAR(42),
  decimals INT DEFAULT 18,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_symbol (symbol)
);

-- Insert default tokens
INSERT INTO tokens (symbol, name, decimals, is_active) VALUES
  ('ETH', 'Ethereum', 18, true),
  ('USDC', 'USD Coin', 6, true),
  ('DAI', 'Dai Stablecoin', 18, true),
  ('USDT', 'Tether USD', 6, true),
  ('WBTC', 'Wrapped Bitcoin', 8, true)
ON DUPLICATE KEY UPDATE is_active = true;
