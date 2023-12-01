import { FaBars, FaXmark } from 'react-icons/fa6';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

import Logo from '../assets/logo.svg';
import LoginModal from './Modals/LoginModal';
import RegisterModal from './Modals/RegisterModal';
import CreateModal from './Modals/CreateModal';

const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isPostOpen, setPostOpen] = useState(false);

  const [isAuth, setIsAuth] = useState(user.accesstoken !== '');

  const logoutCallback = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser({});
    window.location.reload();
  };

  useEffect(() => {
    setIsAuth(user.accesstoken !== '');
  }, [user]);

  return (
    <nav className="relative flex items-center justify-between bg-white p-4 shadow-lg">
      <a href="/">
        <img src={Logo} alt="Logo" className="w-16" />
      </a>
      {!isAuth && (
        <div className="hidden items-center gap-4 sm:flex">
          <button
            onClick={() => setLoginOpen(!isLoginOpen)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Login
          </button>
          <button
            onClick={() => setRegisterOpen(!isRegisterOpen)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Register
          </button>
        </div>
      )}
      {isAuth && (
        <div className="hidden items-center gap-4 sm:flex">
          <button
            onClick={() => setPostOpen(true)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Post
          </button>
          <button
            onClick={logoutCallback}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Log Out
          </button>
        </div>
      )}

      <button className="flex sm:hidden" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? (
          <FaBars className="text-2xl" />
        ) : (
          <FaXmark className="text-2xl" />
        )}
      </button>
      {isOpen && !isAuth && (
        <div className="absolute right-0 top-0 mt-14 flex w-full flex-col items-end gap-2 bg-white p-4 shadow-lg sm:hidden">
          <button
            onClick={() => {
              setIsOpen(false);
              setLoginOpen(!isLoginOpen);
            }}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Login
          </button>
          <button
            onClick={() => setRegisterOpen(!isRegisterOpen)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Register
          </button>
        </div>
      )}

      {isOpen && isAuth && (
        <div className="absolute right-0 top-0 mt-14 flex w-full flex-col items-end gap-2 bg-white p-4 shadow-lg sm:hidden">
          <button
            onClick={() => {
              setIsOpen(false);
              setPostOpen(true);
            }}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Post
          </button>
          <button
            onClick={logoutCallback}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Log Out
          </button>
        </div>
      )}
      {isLoginOpen && (
        <LoginModal isLoginOpen={isLoginOpen} setLoginOpen={setLoginOpen} />
      )}

      {isRegisterOpen && (
        <RegisterModal
          isRegisterOpen={isRegisterOpen}
          setRegisterOpen={setRegisterOpen}
        />
      )}

      {isPostOpen && (
        <CreateModal isPostOpen={isPostOpen} setPostOpen={setPostOpen} />
      )}
    </nav>
  );
};

export default Navbar;
