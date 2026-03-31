'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { SharpSpinner } from "@/components/Loaders";

export default function StripePaymentStep({
  price,
  eventTitle,
  onSuccess,
  onBack,
}: any) {
  const stripe = useStripe();
  const elements = useElements();

  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setPaying(true);
    setErrorMsg('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMsg(submitError.message || 'Validation failed.');
      setPaying(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMsg(error.message || 'Payment failed.');
      setPaying(false);
      return;
    }

    onSuccess();
  };

  return (
    <div className="px-7 py-6 space-y-5 max-h-[75vh] overflow-y-auto">

      {/* Summary */}
      <div className="bg-soft-slate/30 border-2 border-soft-slate p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-bold">Event</span>
          <span className="text-right break-words max-w-[200px]">
            {eventTitle}
          </span>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="font-bold">Total</span>
          <span className="font-black text-lg">${price}</span>
        </div>
      </div>

      {/* Test card */}
      <div className="bg-muted-teal/10 border-2 border-muted-teal/30 px-4 py-3 text-xs">
        Use card <b>4242 4242 4242 4242</b>
      </div>

      {/* Payment */}
      <div className="border-2 border-soft-slate p-4 bg-white overflow-hidden">
        <PaymentElement />
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="text-xs text-red-500 font-bold">
          {errorMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={paying}
          className="flex-1 border-2 py-3"
        >
          Back
        </button>

        <button
          onClick={handlePay}
          disabled={paying || !stripe}
          className="flex-1 bg-muted-teal text-white py-3 font-bold flex items-center justify-center gap-2"
        >
          {paying ? (
            <><SharpSpinner className="w-4 h-4" /> Processing...</>
          ) : (
            `Pay $${price}`
          )}
        </button>
      </div>
    </div>
  );
}