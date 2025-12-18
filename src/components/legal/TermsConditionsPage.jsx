import React from 'react';
import { BookOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditionsPage = () => {
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
          <span className="text-gray-900 font-medium">Terms & Conditions</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-6 bg-red-50 rounded-xl">
              <p className="text-red-800 font-medium text-center">
                By using our services, you agree to be bound by these Terms & Conditions
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eligibility Requirements</h2>
            <ul className="space-y-4 text-gray-700 mb-8">
              <li className="flex items-start">
                <div className="bg-red-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span><strong>Age Requirement:</strong> Renters must be at least 21 years old</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span><strong>Valid License:</strong> Must hold a valid Indian driving license</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span><strong>License Validity:</strong> Driving license must be valid for at least 1 year from the rental start date</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span><strong>ID Proof:</strong> Valid government-issued photo ID (Aadhar, PAN, Passport) required</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Booking & Payment Terms</h2>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span><strong>Full Payment:</strong> Complete payment is required to confirm all bookings</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span><strong>Payment Methods:</strong> We accept credit/debit cards, net banking, UPI, and wallets via Razorpay</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span><strong>Security Deposit:</strong> A refundable security deposit is required at the time of vehicle pickup</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span><strong>Booking Confirmation:</strong> Booking is confirmed only after payment receipt and document verification</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Vehicle Usage & Responsibility</h2>
            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Permitted Use</h3>
                <p className="text-gray-700">Vehicles must be used responsibly and legally within India only</p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Smoking inside the vehicle</li>
                  <li>Transporting illegal substances</li>
                  <li>Using the vehicle for racing, towing, or off-roading</li>
                  <li>Sub-leasing or transferring the vehicle to another person</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Customer Responsibilities</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Maintain the vehicle in good condition</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Use recommended fuel type only</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Return the vehicle in clean condition</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Traffic Violations & Penalties</h2>
            <div className="bg-red-50 p-6 rounded-xl mb-8">
              <p className="text-red-800 font-bold mb-4">⚠️ Important Notice:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-red-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Customers are fully responsible for all traffic violations during the rental period</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>All challans, fines, and penalties will be charged to the customer</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Late payment of traffic fines may result in additional charges</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Damages & Insurance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-yellow-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Damage Responsibility</h3>
                <p className="text-gray-700 text-sm">Customers are responsible for any damages to the vehicle during rental period</p>
              </div>
              <div className="bg-green-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Insurance Coverage</h3>
                <p className="text-gray-700 text-sm">All vehicles come with comprehensive insurance (subject to terms)</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Late Returns & Extensions</h2>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start">
                <div className="bg-orange-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span><strong>Late Return Charges:</strong> 1.5x hourly rate for first 4 hours, 2x daily rate thereafter</span>
              </li>
              <li className="flex items-start">
                <div className="bg-orange-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span><strong>Extension Request:</strong> Must be requested at least 6 hours before scheduled return</span>
              </li>
              <li className="flex items-start">
                <div className="bg-orange-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span><strong>No Show:</strong> Failure to pickup vehicle within 2 hours of scheduled time may result in cancellation</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cancellation Policy</h2>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <p className="text-gray-700 mb-4">Please refer to our separate Cancellation & Refund Policy for detailed information.</p>
              <Link 
                to="/legal/cancellation-policy" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Cancellation Policy →
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Important Notes</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span>These terms are subject to change without prior notice</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span>In case of disputes, the jurisdiction will be Lucknow, Uttar Pradesh</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span>For any clarifications, contact our customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;