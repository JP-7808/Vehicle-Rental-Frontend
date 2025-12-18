// src/components/legal/TermsConditions.jsx
import React from 'react';
import { BookOpen } from 'lucide-react';

const TermsConditions = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 mt-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
      Terms & Conditions
    </h3>
    <ul className="space-y-4 text-gray-700">
      <li className="flex items-start">
        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Renters must be at least 21 years old and hold a valid driving license.</span>
      </li>
      <li className="flex items-start">
        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Full payment is required to confirm bookings.</span>
      </li>
      <li className="flex items-start">
        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Vehicles must be used responsibly and legally.</span>
      </li>
      <li className="flex items-start">
        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Customers are responsible for traffic violations, damages, and late return charges.</span>
      </li>
    </ul>
  </div>
);

export default TermsConditions;