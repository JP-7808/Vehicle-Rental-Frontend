// src/pages/auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [countdown, setCountdown] = useState(0);

  const { verifyEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { email, name } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please enter the complete 6-digit OTP',
      });
      setLoading(false);
      return;
    }

    const result = await verifyEmail(email, otpValue);

    if (result.success) {
      setAlert({
        show: true,
        type: 'success',
        message: 'Email verified successfully! Redirecting...',
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setAlert({
        show: true,
        type: 'error',
        message: result.message,
      });
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      // This would call your resend OTP API
      // For now, we'll simulate success
      setCountdown(60);
      setAlert({
        show: true,
        type: 'success',
        message: 'OTP sent successfully!',
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to resend OTP. Please try again.',
      });
    }

    setResendLoading(false);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {alert.show && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ show: false, type: '', message: '' })}
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Verify Email'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading || countdown > 0}
                className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <LoadingSpinner size="sm" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend OTP'
                )}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;