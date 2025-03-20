import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 shadow-lg border-b border-indigo-900/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Data Breach Lookup
            </span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-indigo-900/50 text-indigo-400'
                  : 'text-indigo-300 hover:bg-indigo-900/30 hover:text-indigo-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-indigo-900/50 text-indigo-400'
                  : 'text-indigo-300 hover:bg-indigo-900/30 hover:text-indigo-400'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;