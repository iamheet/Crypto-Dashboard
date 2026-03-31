import { useEffect } from 'react';

const RazorpayPayment = ({ 
  amount, 
  planName, 
  userEmail, 
  userName, 
  onSuccess, 
  onFailure,
  onClose 
}) => {
  
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initiatePayment();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_here', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      name: 'CryptoNexus',
      description: `${planName} Plan Subscription`,
      image: '/logo.png', // Add your logo
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: '9999999999' // You can make this dynamic
      },
      notes: {
        plan: planName,
        user_email: userEmail
      },
      theme: {
        color: '#8B5CF6' // Purple theme to match your app
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
          onClose();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.log('Payment failed:', response.error);
      onFailure({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason
      });
    });

    rzp.open();
  };

  return null; // This component doesn't render anything
};

export default RazorpayPayment;