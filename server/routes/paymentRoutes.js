
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51RBDgeFjSzArFIpy6pC11z9F9y9p3ijYsg3uub5xSo7Ch7WX5TCMqWwrqisIfi6zMg6UI4uYPTfgzblXhnUb0TSL00cbj4mvGi');

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        orderId
      }
    });
    
    // Update order with payment intent ID
    order.paymentIntentId = paymentIntent.id;
    await order.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Confirm payment success and update order
router.post('/confirm/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentIntentId } = req.body;
    
    // Verify payment intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        message: `Payment not successful. Status: ${paymentIntent.status}` 
      });
    }
    
    // Update order status to confirmed
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update payment info and status
    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.paymentId = paymentIntentId;
    order.updatedAt = new Date();
    
    await order.save();
    
    res.json({ success: true, order });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get payment status
router.get('/status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({ 
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Webhook endpoint to handle Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          order.updatedAt = new Date();
          await order.save();
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedOrderId = failedPayment.metadata.orderId;
      
      if (failedOrderId) {
        const order = await Order.findById(failedOrderId);
        if (order) {
          order.paymentStatus = 'failed';
          order.updatedAt = new Date();
          await order.save();
        }
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
});

module.exports = router;
