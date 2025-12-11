import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { paymentAPI } from '../../api/payment';
import Swal from 'sweetalert2';
import { FaCreditCard, FaTimes } from 'react-icons/fa';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ contestId, contestName, amount, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Payment Error',
          text: error.message,
          confirmButtonColor: '#20beff',
          confirmButtonText: 'Try Again'
        });
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await paymentAPI.confirmPayment(paymentIntent.id, contestId);
        
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'You have successfully joined the contest.',
          confirmButtonColor: '#20beff',
          timer: 2000,
          timerProgressBar: true
        });
        
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      const message = error.response?.data?.message || 'Payment failed. Please try again.';
      setErrorMessage(message);
      
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: message,
        confirmButtonColor: '#20beff'
      });
      
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-[#20beff]">
        <h3 className="font-bold text-lg mb-2 ">{contestName}</h3>
        <p className="text-3xl font-bold text-[#20beff]">
          ${amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 mt-2">Entry Fee</p>
      </div>

      <div className=" p-4 rounded-lg border border-gray-200">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="alert alert-error">
          <FaTimes />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="btn btn-outline flex-1 rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn bg-[#20beff] hover:bg-[#1a9fd9] text-white flex-1 rounded-full border-none"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <FaCreditCard />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ contestId, contestName, onSuccess }) {
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPaymentIntent = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await paymentAPI.createPaymentIntent(contestId);
      setClientSecret(data.clientSecret);
      setAmount(data.amount);
    } catch (error) {
      console.error('Error loading payment:', error);
      const message = error.response?.data?.message || 'Failed to load payment form';
      setError(message);
      
      Swal.fire({
        icon: 'error',
        title: 'Payment Setup Failed',
        text: message,
        confirmButtonColor: '#20beff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    document.getElementById('payment_modal').close();
    setIsModalOpen(false);
    setClientSecret('');
    setAmount(0);
    setError('');
  };

  const handleOpen = () => {
    setIsModalOpen(true);
    document.getElementById('payment_modal').showModal();
    loadPaymentIntent();
  };

  useEffect(() => {
    window.openPaymentModal = handleOpen;
    return () => {
      delete window.openPaymentModal;
    };
  }, [contestId]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#20beff',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <FaCreditCard className="text-[#20beff]" />
            Complete Payment
          </h3>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-[#20beff]"></span>
            <p className="mt-4 text-gray-600">Loading payment form...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-outline rounded-full"
            >
              Close
            </button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              contestId={contestId}
              contestName={contestName}
              amount={amount}
              onSuccess={onSuccess}
              onClose={handleClose}
            />
          </Elements>
        ) : null}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured by Stripe
          </p>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}