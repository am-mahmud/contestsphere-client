
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Outlet } from 'react-router';


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;