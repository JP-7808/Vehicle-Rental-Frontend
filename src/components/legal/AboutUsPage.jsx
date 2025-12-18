import React from 'react';
import { Info, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">About Us</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
            <Info className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Asia & Company Self Drive</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for self-drive vehicle rentals across India
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to <strong className="text-blue-600">Asia and Company Self Drive</strong>, 
              your trusted partner for self-drive vehicle rentals across India. 
              We are committed to giving you complete freedom, comfort, and control over your travel.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              At Asia and Company, we believe that travel should be about freedom, comfort, and 
              creating memories. We understand that every journey is unique, and we're here to 
              provide you with the perfect vehicle for your adventure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  To provide reliable, affordable, and convenient self-drive vehicle rentals 
                  that empower our customers to explore India on their own terms.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  To become India's most trusted self-drive rental service, known for 
                  exceptional customer experience and vehicle quality.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Services</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Well-maintained cars and bikes for daily use</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Weekend getaway vehicles</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Business travel solutions</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Long journey rentals with unlimited kilometers</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Transparent pricing with no hidden charges</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Flexible booking options</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>24/7 customer support</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why Choose Us?</h2>
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl my-6">
              <p className="text-gray-700 leading-relaxed">
                Our services focus on transparent pricing, flexible bookings, and reliable customer support. 
                We maintain our vehicles to the highest standards, ensuring your safety and comfort on every journey.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-6 rounded-xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Need Assistance?</h3>
                  <p className="text-gray-600">Our team is here to help you 24/7</p>
                </div>
                <Link 
                  to="/contact" 
                  className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;