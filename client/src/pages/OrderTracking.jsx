import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, CheckCircle, Truck, MapPin, Clock, Phone, 
  Mail, User, ArrowLeft, Loader2, AlertCircle 
} from 'lucide-react';
import * as ordersApi from '../api/orders.api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { id: orderId } = useParams(); // Route param is "id", rename to orderId
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('OrderTracking mounted, orderId:', orderId);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }

    if (!orderId) {
      console.error('Order ID is missing from URL params');
      toast.error('Order ID is required');
      navigate('/profile');
      return;
    }

    console.log('Fetching order with ID:', orderId);
    fetchOrder();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getOrder(orderId);
      console.log('Order fetched:', response.data);
      setOrder(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    return [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'preparing', label: 'Preparing', icon: Clock },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];
  };

  const getStatusIndex = (status) => {
    const steps = getStatusSteps();
    return steps.findIndex(step => step.key === status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-xl text-gray-600 mb-4">Order not found</p>
        <Link to="/profile" className="text-orange-600 hover:text-orange-700 font-semibold">
          View All Orders
        </Link>
      </div>
    );
  }

  const steps = getStatusSteps();
  const currentStepIndex = getStatusIndex(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/profile" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>

              <div className="relative">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start mb-8 last:mb-0">
                      {/* Timeline Line */}
                      {index < steps.length - 1 && (
                        <div className={`absolute left-5 top-12 w-0.5 h-16 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} style={{ marginTop: `${index * 88}px` }} />
                      )}

                      {/* Icon */}
                      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="ml-4 flex-1">
                        <h3 className={`text-lg font-semibold ${
                          isCurrent ? 'text-orange-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <p className="text-sm text-gray-600 mt-1">In progress...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {order.status === 'cancelled' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Order Cancelled</span>
                  </div>
                  {order.cancellationReason && (
                    <p className="text-sm text-red-700 mt-2">Reason: {order.cancellationReason}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🍊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {item.product?.name || 'Product'}
                      </h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {item.variant?.size} - {item.variant?.volume}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-600" />
                Delivery Address
              </h2>

              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{order.deliveryAddress.fullName}</p>
                <p className="text-gray-700">{order.deliveryAddress.street}</p>
                <p className="text-gray-700">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
                <p className="text-gray-700">{order.deliveryAddress.country}</p>
                {order.deliveryAddress.phone && (
                  <p className="text-gray-700 flex items-center gap-2 mt-3">
                    <Phone className="w-4 h-4" />
                    {order.deliveryAddress.phone}
                  </p>
                )}
              </div>

              {order.deliveryInstructions && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Instructions:</strong> {order.deliveryInstructions}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Order Summary & Rider Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-semibold text-gray-900">
                    #{order.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-semibold capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${order.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
                </div>

                {(order.pricing?.discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${order.pricing?.discount?.toFixed(2) || '0.00'}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">${order.pricing?.deliveryFee?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">${order.pricing?.tax?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-600">${order.pricing?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rider Information */}
            {order.rider && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-600" />
                  Delivery Rider
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{order.rider.name}</p>
                      <p className="text-sm text-gray-600">Delivery Partner</p>
                    </div>
                  </div>

                  {order.rider.phone && (
                    <a
                      href={`tel:${order.rider.phone}`}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      {order.rider.phone}
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-orange-50 border border-orange-200 rounded-lg p-6"
            >
              <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Contact our customer support for any questions about your order.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call: +1 (234) 567-890
                </a>
                <a
                  href="mailto:support@quickjuice.com"
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  <Mail className="w-4 h-4" />
                  support@quickjuice.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;