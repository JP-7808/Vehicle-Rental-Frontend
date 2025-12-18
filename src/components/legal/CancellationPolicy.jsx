// src/components/legal/CancellationPolicy.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const CancellationPolicy = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <AlertCircle className="h-5 w-5 mr-2 text-primary-600" />
      Cancellation & Refund Policy
    </h3>
    <ul className="space-y-4 text-gray-700">
      <li className="flex items-start">
        <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Cancellations made 48 hours before pickup may receive partial refunds.</span>
      </li>
      <li className="flex items-start">
        <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Cancellations within 48 hours or no-shows may not be refunded.</span>
      </li>
      <li className="flex items-start">
        <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
        </div>
        <span className="leading-relaxed">Refunds are processed to the original payment method within 15–45 business days.</span>
      </li>
    </ul>
  </div>
);

export default CancellationPolicy;