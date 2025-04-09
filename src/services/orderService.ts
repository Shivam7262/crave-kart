
import api from './api';
import axios from 'axios';

export const createOrder = async (orderData: {
  customerId: string;
  shopId: string;
  items: Array<{ foodItem: string; quantity: number }>;
  totalAmount: number;
  address: string;
  appliedOfferId?: string;
}) => {
  try {
    // Log the order data before sending
    console.log('Creating order with data:', orderData);
    
    // Ensure we're sending the correct ID format
    // MongoDB can handle both string ID and ObjectId
    const processedOrderData = {
      ...orderData,
      // Ensure IDs are string format for consistency
      customerId: orderData.customerId?.toString(),
      shopId: orderData.shopId?.toString(),
      items: orderData.items.map(item => ({
        ...item,
        foodItem: item.foodItem?.toString()
      }))
    };
    
    // Add timeout to prevent hanging requests
    const response = await api.post('/orders', processedOrderData, { timeout: 10000 });
    console.log('Order created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    
    // More detailed error handling
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timed out. Please try again.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection to the server.');
      }
      
      if (error.response) {
        // Get the specific error message from the server response
        const errorMessage = error.response.data.message || 'Failed to create order';
        console.error('Server error response:', error.response.data);
        throw new Error(errorMessage);
      }
    }
    
    throw new Error('Failed to create order');
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    console.log('Fetching orders for user:', userId);
    const response = await api.get(`/orders/user/${userId}`);
    
    // Ensure we only return orders that belong to this user
    const orders = response.data;
    console.log(`Received ${orders.length} orders for user ${userId}`);
    
    // Additional validation to ensure orders belong to the user
    const validOrders = orders.filter(order => {
      const orderCustomerId = typeof order.customer === 'string' 
        ? order.customer 
        : (order.customer._id || order.customer.id);
      
      const isUserOrder = orderCustomerId === userId;
      if (!isUserOrder) {
        console.warn(`Filtering out order ${order._id || order.id} that doesn't belong to user ${userId}`);
      }
      return isUserOrder;
    });
    
    console.log(`Returning ${validOrders.length} verified orders for user ${userId}`);
    return validOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch orders');
    }
    throw new Error('Failed to fetch orders');
  }
};

export const getShopOrders = async (shopId: string) => {
  try {
    const response = await api.get(`/orders/shop/${shopId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch orders');
    }
    throw new Error('Failed to fetch orders');
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update order');
    }
    throw new Error('Failed to update order');
  }
};
