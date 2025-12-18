// src/components/legal/PrivacyPolicy.jsx
import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <Shield className="h-5 w-5 mr-2 text-primary-600" />
      Privacy Policy
    </h3>
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed">
        Asia and Company Self Drive respects your privacy and protects your personal information.
      </p>
      <ul className="space-y-3 text-gray-700">
        <li className="flex items-start">
          <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
          <span className="leading-relaxed">Information collected includes name, contact details, driving license, ID proof (PDF/Image), and payment details.</span>
        </li>
        <li className="flex items-start">
          <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
          <span className="leading-relaxed">Your data is used only for bookings, verification, support, and service improvement.</span>
        </li>
        <li className="flex items-start">
          <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
          <span className="leading-relaxed">We do not sell or misuse your data.</span>
        </li>
      </ul>
    </div>
  </div>
);

export default PrivacyPolicy;