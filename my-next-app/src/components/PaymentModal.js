'use client';

import { useState } from 'react';
import { X, CreditCard, Shield, Check } from 'lucide-react';
import RazorpayPayment from './RazorpayPayment';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  plan, 
  user, 
  onPaymentSuccess, 
  onPaymentFailure,
  billingCycle = 'monthly' // 'monthly' or 'yearly'
}) => {
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const planPrice = billingCycle === 'monthly' ? plan?.monthlyPrice : plan?.yearlyPrice;
  const billingText = billingCycle === 'monthly' ? '/month' : '/year';

  const handlePayNow = () => {
    setShowRazorpay(true);
  };

  const handleRazorpaySuccess = (paymentData) => {
    setShowRazorpay(false);
    onPaymentSuccess(paymentData);
  };

  const handleRazorpayFailure = (error) => {
    setShowRazorpay(false);
    onPaymentFailure(error);
  };

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
  };

  return (
    <>
      {/* Payment Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Complete Payment</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Plan Details */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Plan</span>
                <span className="text-white font-semibold">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Price</span>
                <span className="text-white font-semibold">${planPrice}{billingText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">User</span>
                <span className="text-white font-semibold">{user?.username}</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">What you'll get:</h4>
              <div className="space-y-2">
                {plan.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <div className="text-sm text-gray-400">
                    +{plan.features.length - 3} more features
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
              <div className="flex items-center text-blue-400 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure payment powered by Razorpay</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>{processing ? 'Processing...' : `Pay $${planPrice}`}</span>
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              You can cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Payment Component */}
      {showRazorpay && (
        <RazorpayPayment
          amount={planPrice}
          planName={plan.name}
          userEmail={user.email}
          userName={user.username}
          onSuccess={handleRazorpaySuccess}
          onFailure={handleRazorpayFailure}
          onClose={handleRazorpayClose}
        />
      )}
    </>
  );
};

export default PaymentModal;