import React from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const CancellationPolicyPage = () => {
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
          <span className="text-gray-900 font-medium">Cancellation Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellation & Refund Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our transparent policy for cancellations and refunds
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-6 bg-yellow-50 rounded-xl">
              <p className="text-yellow-800 font-medium text-center">
                ⚠️ Please read this policy carefully before making any booking
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancellation Timeline & Refunds</h2>
            
            {/* Cancellation Timeline Visual */}
            <div className="mb-10">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                
                <div className="relative flex justify-between items-center">
                  {/* 48+ Hours */}
                  <div className="relative flex flex-col items-center w-1/3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 z-10">
                      <div className="text-green-600 font-bold">48h+</div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 mb-1">Before 48 Hours</h3>
                      <p className="text-sm text-green-600 font-medium">Partial Refund</p>
                    </div>
                  </div>
                  
                  {/* 48 Hours */}
                  <div className="relative flex flex-col items-center w-1/3">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 z-10">
                      <div className="text-yellow-600 font-bold">48h</div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 mb-1">Within 48 Hours</h3>
                      <p className="text-sm text-yellow-600 font-medium">No Refund</p>
                    </div>
                  </div>
                  
                  {/* No Show */}
                  <div className="relative flex flex-col items-center w-1/3">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 z-10">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 mb-1">No Show</h3>
                      <p className="text-sm text-red-600 font-medium">No Refund</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Detailed Policy</h2>
            
            <div className="space-y-8 mb-10">
              {/* Before 48 Hours */}
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">1</div>
                  Cancellations Made 48+ Hours Before Pickup
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <div className="bg-green-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span>May receive partial refunds (subject to processing fees)</span>
                  </p>
                  <p className="flex items-start">
                    <div className="bg-green-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Processing fees of 10% or ₹500 (whichever is higher) will be deducted</span>
                  </p>
                  <p className="flex items-start">
                    <div className="bg-green-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Refund amount will be calculated based on the time of cancellation</span>
                  </p>
                </div>
              </div>
              
              {/* Within 48 Hours */}
              <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center mr-3">2</div>
                  Cancellations Within 48 Hours of Pickup
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <div className="bg-yellow-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                    </div>
                    <span>Generally no refunds will be provided</span>
                  </p>
                  <p className="flex items-start">
                    <div className="bg-yellow-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                    </div>
                    <span>In exceptional circumstances (medical emergencies), please contact support with valid proof</span>
                  </p>
                  <p className="flex items-start">
                    <div className="bg-yellow-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                    </div>
                    <span>Management reserves the right to make exceptions on case-by-case basis</span>
                  </p>
                </div>
              </div>
              
              {/* No Show */}
              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center mr-3">3</div>
                  No Show (Failure to Pickup)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <div className="bg-red-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    </div>
                    <span>No refunds will be provided for no-shows</span>
                  </p>
                  <p className="flex items-start">
                    <div className="bg-red-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    </div>
                    <span>Vehicle will be held for maximum 2 hours from scheduled pickup time</span>
                  </p>
                  <p className="flex items-start">
                    <div className="bg-red-200 p-1 rounded-full mr-3 mt-1">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    </div>
                    <span>After 2 hours, booking will be considered cancelled with no refund</span>
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Refund Processing</h2>
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">1</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Processing Time</h4>
                    <p className="text-gray-700">Refunds are processed within 15–45 business days from cancellation date</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">2</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Refund Method</h4>
                    <p className="text-gray-700">All refunds are processed to the original payment method used during booking</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">3</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Bank Processing</h4>
                    <p className="text-gray-700">Bank processing times may vary and are beyond our control</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Important Notes</h2>
            <div className="space-y-4 text-gray-700 mb-10">
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Policy Updates</p>
                  <p className="text-sm">Asia and Company Self Drive reserves the right to update these policies without prior notice</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Special Circumstances</p>
                  <p className="text-sm">In case of natural disasters, government restrictions, or other force majeure events, special consideration may be given</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Refund Status</p>
                  <p className="text-sm">You can check your refund status in your booking history or contact customer support</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How to Cancel</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white border border-gray-200 p-5 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Go to My Bookings</h3>
                <p className="text-sm text-gray-600">Access your booking from dashboard</p>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Select Booking</h3>
                <p className="text-sm text-gray-600">Choose the booking you want to cancel</p>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Cancel & Confirm</h3>
                <p className="text-sm text-gray-600">Follow prompts to complete cancellation</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-gray-700 mb-2">For cancellation assistance or refund queries:</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600"><strong>Phone:</strong> +91 75260 51009</p>
                      <p className="text-sm text-gray-600"><strong>Email:</strong> support@asiaandcompanyselfdrive.com</p>
                    </div>
                  </div>
                  <h1 
                    
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    Contact Support
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;