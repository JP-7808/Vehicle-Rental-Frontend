import React from 'react';
import { Shield, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How we protect and use your personal information
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-6 bg-green-50 rounded-xl">
              <p className="text-green-800 font-medium text-center">
                Last Updated: December 2024
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              <strong className="text-blue-600">Asia and Company Self Drive</strong> respects your privacy 
              and is committed to protecting your personal information. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect the following personal information:</p>
            <ul className="space-y-4 text-gray-700 mb-8">
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span><strong>Personal Details:</strong> Name, email address, phone number, date of birth</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span><strong>Identity Documents:</strong> Driving license, ID proof (uploaded as PDF/Image)</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span><strong>Payment Information:</strong> Card details (processed securely via Razorpay), transaction history</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span><strong>Booking Details:</strong> Vehicle preferences, rental dates, pickup/drop locations</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span><strong>Usage Data:</strong> IP address, browser type, device information, pages visited</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">Your data is used strictly for the following purposes:</p>
            <ul className="space-y-4 text-gray-700 mb-8">
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span><strong>Service Provision:</strong> To process bookings, verify identity, and provide vehicle rental services</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span><strong>Customer Support:</strong> To respond to inquiries, provide assistance, and resolve issues</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span><strong>Service Improvement:</strong> To enhance our platform, services, and user experience</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span><strong>Communication:</strong> To send booking confirmations, updates, and important notices</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Protection & Security</h2>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span>We implement industry-standard security measures to protect your personal information</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span>Payment processing is handled by Razorpay, a PCI DSS compliant payment gateway</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span>Regular security audits and vulnerability assessments are conducted</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span>Access to personal data is restricted to authorized personnel only</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Sharing & Disclosure</h2>
            <p className="text-gray-700 mb-6">
              <strong className="text-red-600">We do not sell or rent your personal information to third parties.</strong> 
              We may share your information only in the following circumstances:
            </p>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start">
                <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
                <span>With service providers who assist in our operations (e.g., payment processors, SMS services)</span>
              </li>
              <li className="flex items-start">
                <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
                <span>When required by law or legal process</span>
              </li>
              <li className="flex items-start">
                <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
                <span>To protect our rights, property, or safety, or that of others</span>
              </li>
              <li className="flex items-start">
                <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
                <span>With your explicit consent</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Access & Correction</h3>
                <p className="text-gray-700 text-sm">You can access and update your personal information in your account settings</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Data Deletion</h3>
                <p className="text-gray-700 text-sm">Request deletion of your data, subject to legal retention requirements</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> support@asiaandcompanyselfdrive.com</p>
                  <p><strong>Phone:</strong> +91 75260 51009</p>
                  <p><strong>Address:</strong> 665 Sevai Barauna, Near Sector 14, Vrindavan Yojna, Lucknow, Uttar Pradesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;