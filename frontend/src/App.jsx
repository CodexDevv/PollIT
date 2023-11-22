import { useState, useEffect, createContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';

import Home from './pages/Home';

export const UserContext = createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRefreshToken() {
      const res = await (
        await fetch('http://localhost:5000/refresh_token', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();
      setUser({
        accesstoken: res.accesstoken,
      });
      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
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
    </UserContext.Provider>
  );
}

export default App;
