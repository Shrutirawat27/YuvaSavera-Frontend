import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, LogOut, ChevronDown, User, FileText, Flag } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(user);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUserInfo(null);
    navigate("/login");
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Political Awareness', path: '/political-awareness' },
    { name: 'Browse Requests', path: '/browse-requests' },
    { name: 'Story Wall', path: '/story-wall' },
    { name: 'Report Issue', path: '/report-issue' }

  ];

  // Different dropdown menu items based on role
  const renderDropdownItems = () => {
    if (userInfo?.role === "help_seeker") {
      return (
        <>
          <Link
            to="/my-profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" /> My Profile
          </Link>
          <Link
            to="/my-requests"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileText className="w-4 h-4 mr-2" /> My Requests
          </Link>
          <Link
            to="/my-campaigns"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Flag className="w-4 h-4 mr-2" /> My Campaigns
          </Link>
        </>
      );
    }

    if (userInfo?.role === "volunteer") {
      return (
        <>
          <Link
            to="/dashboard"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </Link>
         <Link
  to="/volunteer/my-campaigns"
  onClick={() => setDropdownOpen(false)}
  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
  <Flag className="w-4 h-4 mr-2" /> My Campaigns
</Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Yuva Savera</h1>
              <p className="text-xs text-orange-500 font-medium">
                Ek Naya Savera, Yuva Ke Saath
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* User Dropdown / Login */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors duration-200"
                >
                  <span>{userInfo.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 border border-gray-200"
                    >
                      {renderDropdownItems()}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-6 px-5 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-orange-500 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-white border-t border-gray-200 mt-2 rounded-lg shadow-md"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 text-sm rounded-md ${
                      location.pathname === item.path
                        ? "text-orange-500 bg-gray-100"
                        : "text-gray-700 hover:text-orange-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {userInfo ? (
                  <>
                    {renderDropdownItems()}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 mt-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 mt-2 text-sm bg-orange-500 text-white rounded-md text-center hover:bg-orange-600"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;