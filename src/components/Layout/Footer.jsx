import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Yuva Savera</h3>
                <p className="text-xs text-orange-400">Ek Naya Savera, Yuva Ke Saath</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering Indian youth to create positive social change and build stronger communities through volunteerism and civic engagement.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                About Us
              </Link>
              <Link to="/how-it-works" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                How It Works
              </Link>
              <Link to="/campaigns" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                Campaigns & Events
              </Link>
              <Link to="/story-wall" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                Success Stories
              </Link>
            </div>
          </div>

          {/* Get Involved */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get Involved</h4>
            <div className="space-y-2">
              <Link to="/volunteer-registration" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                Volunteer Registration
              </Link>
              <Link to="/submit-help-request" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                Request Help
              </Link>
              <Link to="/partner-registration" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                Partner with Us
              </Link>
              <Link to="/political-awareness" className="block text-gray-300 hover:text-orange-400 transition-colors text-sm">
                Political Awareness
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">info@yuvasavera.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">+91-1800-123-4567</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Youth Empowerment Center,<br />
                  Connaught Place, New Delhi - 110001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Yuva Savera. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;