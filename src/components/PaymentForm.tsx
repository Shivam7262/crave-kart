
import { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  clientSecret: string;
  isLoading: boolean;
}

const PaymentFormContent = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  isLoading
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setPaymentProcessing(true);

    // Get the card element
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentError("Card element not found");
      setPaymentProcessing(false);
      return;
    }

    try {
      // Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (error) {
        setPaymentError(error.message || "Payment failed");
        onPaymentError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentError(null);
        onPaymentSuccess(paymentIntent.id);
      } else {
        setPaymentError("Payment status unknown. Please check your order status.");
      }
    } catch (error) {
      setPaymentError("An unexpected error occurred");
      onPaymentError("An unexpected error occurred");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border rounded-md"
        />
      </div>

      {paymentError && (
        <Alert variant="destructive">
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || paymentProcessing || isLoading}
        className="w-full bg-black hover:bg-gray-800 text-white"
      >
        {paymentProcessing
          ? "Processing..."
          : `Pay ${new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(amount / 100)}`}
      </Button>
    </form>
  );
};

interface WrappedPaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  clientSecret: string | null;
  isLoading: boolean;
}

const PaymentForm = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  isLoading
}: WrappedPaymentFormProps) => {
  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent
        amount={amount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        clientSecret={clientSecret}
        isLoading={isLoading}
      />
    </Elements>
  );
};

export default PaymentForm;
