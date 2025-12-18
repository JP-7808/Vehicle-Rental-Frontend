// src/components/legal/AboutUs.jsx
import React from 'react';
import { Info } from 'lucide-react';

const AboutUs = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <Info className="h-5 w-5 mr-2 text-primary-600" />
      About Us
    </h3>
    <div className="space-y-4 text-gray-700">
      <p className="leading-relaxed">
        Welcome to Asia and Company Self Drive, your trusted partner for self-drive vehicle rentals across India. 
        We are committed to giving you complete freedom, comfort, and control over your travel.
      </p>
      <p className="leading-relaxed">
        We provide well-maintained cars and bikes for daily use, weekend trips, business travel, and long journeys. 
        Our services focus on transparent pricing, flexible bookings, and reliable customer support.
      </p>
    </div>
  </div>
);

export default AboutUs;