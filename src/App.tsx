import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { WagmiProvider, createClient } from 'wagmi';
import NavBar from './components/NavBar';
import Home from './screens/Home';
import Stakes from './screens/Stakes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const client = createClient({
    autoConnect: true,
  });

  return (
    <WagmiProvider client={client}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stakes" element={<Stakes />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </WagmiProvider>
  );
}

export default App;
