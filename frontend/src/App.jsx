import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';

import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';

function App() {
  return (
    <div className="flex min-h-[100dvh] flex-col justify-between space-y-4 bg-it bg-cover bg-no-repeat">
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
