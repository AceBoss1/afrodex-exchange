// pages/_app.js
import '../styles/globals.css'
import WagmiProvider from '../components/WagmiProvider'

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider>
      <Component {...pageProps} />
    </WagmiProvider>
  )
}

export default MyApp
