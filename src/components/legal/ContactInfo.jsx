// src/components/legal/ContactInfo.jsx
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <Phone className="h-5 w-5 mr-2 text-primary-600" />
      Contact Us
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-start space-x-3">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Phone className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="font-medium text-gray-900">+91 75260 51009</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Mail className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">support@asiaandcompanyselfdrive.com</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 md:col-span-2">
        <div className="bg-primary-100 p-2 rounded-lg">
          <MapPin className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium text-gray-900">
            665 Sevai Barauna, Near Sector 14, Vrindavan Yojna, Lucknow, Uttar Pradesh, India
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Clock className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Business Hours</p>
          <p className="font-medium text-gray-900">Monday – Sunday</p>
          <p className="text-sm text-gray-600">9:00 AM – 7:00 PM</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactInfo;