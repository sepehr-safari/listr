import TopHeader from './TopHeader';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header className="fixed top-0 z-20 w-full bg-base-200 bg-opacity-50 shadow-lg shadow-black backdrop-blur-lg">
      <TopHeader />

      <Navbar />
    </header>
  );
}
