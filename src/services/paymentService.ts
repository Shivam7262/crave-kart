
import api from './api';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your own publishable key from the Stripe Dashboard
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RBDgeFjSzArFIpyuqeVh5tMe2kSgCGC0LV9Lj9ALsmEfpdjJiDtZa6EEuKjX2CNYdC5Qehtjhe2K5yq70RgyAz800McSad92h';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Create a payment intent for an order
export const createPaymentIntent = async (orderData: {
  totalAmount: number;
  currency?: string;
  orderId?: string;
}) => {
  try {
    const { totalAmount, currency = 'inr', orderId } = orderData;
    
    console.log('Creating payment intent for amount:', totalAmount);
    
    // Call backend API to create a payment intent
    const response = await api.post('/payments/create-intent', {
      amount: Math.round(totalAmount * 100), // Convert to cents/paise
      currency,
      orderId
    });
    
    console.log('Payment intent created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to process payment');
    }
    throw new Error('Failed to process payment');
  }
};

// Process a payment with card details
export const processPayment = async (
  paymentMethodId: string, 
  clientSecret: string
) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Failed to initialize Stripe');
    
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return paymentIntent;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Handle successful payment
export const handleSuccessfulPayment = async (orderId: string, paymentIntentId: string) => {
  try {
    const response = await api.post(`/payments/confirm/${orderId}`, {
      paymentIntentId
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};
