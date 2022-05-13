import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { WagmiProvider, createClient } from 'wagmi';
import NavBar from './components/NavBar';
import Home from './screens/Home';
import Stakes from './screens/Stakes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { providers } from 'ethers';
import Market from './screens/Market';

const App = () => {
  const INFURA_KEY = process.env.REACT_APP_PROVIDER_API_KEY;
  const client = createClient({
    autoConnect: true,
    provider(config) {
      return new providers.InfuraProvider(config.chainId, INFURA_KEY);
    },
  });

  return (
    <WagmiProvider client={client}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<Market />} />
          <Route path="/stakes" element={<Stakes />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </WagmiProvider>
  );
}

export default App;
