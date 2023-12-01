import { useState, useEffect, createContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';

import Home from './pages/Home';

export const UserContext = createContext([]);
export const PollsContext = createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [polls, setPolls] = useState([]);
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingPolls, setLoadingPolls] = useState(true);

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
        email: res.email,
      });
      setLoadingToken(false);
    }
    checkRefreshToken();
  }, []);

  const fetchPolls = async () => {
    setLoadingPolls(true);
    const res = await (await fetch('http://localhost:5000/get_polls')).json();
    setPolls(res);
    setLoadingPolls(false);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  if (loadingPolls || loadingToken) return <div>Loading...</div>;

  return (
    <PollsContext.Provider value={{ polls, setPolls, fetchPolls }}>
      <UserContext.Provider value={{ user, setUser }}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
        <ToastContainer />
      </UserContext.Provider>
    </PollsContext.Provider>
  );
}

export default App;
