import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="text-2xl font-bold text-primary">
        <Link to="/">ClinicOrbit</Link>
      </div>
      <div className="space-x-6 flex items-center">
        <Link to="/" className="text-gray-600 hover:text-primary transition font-medium">Home</Link>
        <Link to="/login" className="text-gray-600 hover:text-primary transition font-medium">Login</Link>
        <Link to="/dashboard" className="bg-primary text-white px-5 py-2 rounded-full shadow-lg hover:bg-secondary transition font-medium">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
