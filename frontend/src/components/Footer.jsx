import { FaInstagram, FaTwitch, FaFacebookSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary flex h-24 items-center justify-center gap-16 p-4 text-white">
      <a className="text-6xl transition-all hover:text-gray-300" href="#">
        <FaInstagram />
      </a>
      <a className="text-6xl transition-all hover:text-gray-300" href="#">
        <FaFacebookSquare />
      </a>
      <a className="text-5xl transition-all hover:text-gray-300" href="#">
        <FaTwitch />
      </a>
    </footer>
  );
};

export default Footer;
