import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { WagmiProvider, createClient } from 'wagmi';
import NavBar from './components/NavBar';
import Home from './screens/Home';

const App = () => {
  const client = createClient({
    autoConnect: true,
  });

  return (
    <WagmiProvider client={client}>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </WagmiProvider>
  );
}

export default App;
