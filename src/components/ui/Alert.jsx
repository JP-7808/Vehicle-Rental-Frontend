// src/components/ui/Alert.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400'
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`mt-2 text-sm ${config.textColor}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md ${config.bgColor} ${config.textColor} hover:${config.bgColor.replace('50', '100')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bgColor.replace('bg-', '').replace('-50', '')} focus:ring-${config.iconColor.replace('text-', '')}`}
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;