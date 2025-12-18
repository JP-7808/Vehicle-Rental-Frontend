// src/components/legal/LegalPolicies.jsx
import React, { useState } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import ContactInfo from './ContactInfo';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';
import CancellationPolicy from './CancellationPolicy';

const LegalPolicies = () => {
  const [showLegalSection, setShowLegalSection] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="bg-gray-50 rounded-2xl p-6">
        <button
          onClick={() => setShowLegalSection(!showLegalSection)}
          className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
          aria-expanded={showLegalSection}
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-2 rounded-lg mr-4">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Legal Policies & Information</h3>
              <p className="text-sm text-gray-600">Click to view terms, privacy policy, and contact info</p>
            </div>
          </div>
          <ChevronRight 
            className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
              showLegalSection ? 'rotate-90' : ''
            }`}
          />
        </button>
        
        {showLegalSection && (
          <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
            <ContactInfo />
            <AboutUs />
            <PrivacyPolicy />
            <TermsConditions />
            <CancellationPolicy />
            
            {/* Important Note */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-6">
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-800 mb-2">Important Note:</h4>
                  <p className="text-orange-700">
                    Asia and Company Self Drive reserves the right to update these policies without prior notice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LegalPolicies;