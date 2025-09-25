import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/services/api';
import Loader from '@/components/Loader';
import Alert from '@/components/Alert';
import { formatCurrency, formatDate, imageUrl } from '@/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiX,
  HiCheck,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCreditCard,
  HiOutlineLocationMarker,
  HiOutlineCalendar
} from 'react-icons/hi';

// Define types
interface OrderItem {
  id: number;
  bookId: number;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
  username?: string;
}

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  // Fetch all orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => ordersApi.all().then(r => r.data),
    onError: (err) => console.error('Error fetching orders:', err)
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number, status: string }) =>
      ordersApi.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      setEditModalOpen(false);
      setSelectedOrder(null);
    },
    onError: (err) => console.error('Error updating order status:', err)
  });

  // Toggle order expansion
  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Open edit modal
  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setStatusForm(order.status);
    setEditModalOpen(true);
  };

  // Handle status update
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateStatusMutation.mutate({
      orderId: selectedOrder.id,
      status: statusForm
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader label="Loading orders..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Failed to load orders. Please try again later."
          type="error"
        />
      </div>
    );
  }

  // Empty state
  const orders: Order[] = data || [];
  if (orders.length === 0) {
    return (
      <div className="card p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Order Management</h2>
        <p className="text-text_secondary-light dark:text-text_secondary-dark mb-4">No orders found in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="section-title">Order Management</h2>

      {/* Orders List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text_secondary-light dark:text-text_secondary-dark">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text_secondary-light dark:text-text_secondary-dark">
                      {order.username || `User #${order.userId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(order); }}
                          className="text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80"
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                        {expandedOrder === order.id ? (
                          <HiOutlineChevronUp size={18} />
                        ) : (
                          <HiOutlineChevronDown size={18} />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded order details */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                                Order Details
                              </h4>
                              <div className="flex items-center gap-1 text-sm">
                                <HiOutlineCalendar className="text-text_secondary-light dark:text-text_secondary-dark" size={16} />
                                <span>{new Date(order.orderDate).toLocaleString()}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                                Shipping Address
                              </h4>
                              <div className="flex items-start gap-1 text-sm">
                                <HiOutlineLocationMarker className="mt-1 flex-shrink-0 text-text_secondary-light dark:text-text_secondary-dark" size={16} />
                                <span>{order.shippingAddress || 'Not specified'}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                                Payment Method
                              </h4>
                              <div className="flex items-center gap-1 text-sm">
                                <HiOutlineCreditCard className="text-text_secondary-light dark:text-text_secondary-dark" size={16} />
                                <span>{order.paymentMethod || 'Not specified'}</span>
                              </div>
                            </div>
                          </div>

                          <h4 className="font-medium">Order Items</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                  <th className="px-4 py-2 text-left">Item</th>
                                  <th className="px-4 py-2 text-center">Quantity</th>
                                  <th className="px-4 py-2 text-right">Price</th>
                                  <th className="px-4 py-2 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {order.items?.map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-4 py-2">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={imageUrl(item.image)}
                                          alt={item.title}
                                          className="w-8 h-10 object-cover rounded"
                                        />
                                        <span>{item.title}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                    <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50 dark:bg-gray-800">
                                  <td colSpan={3} className="px-4 py-2 text-right font-medium">Total:</td>
                                  <td className="px-4 py-2 text-right font-bold">{formatCurrency(order.totalAmount)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      <AnimatePresence>
        {editModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold">Update Order Status</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-text_secondary-light dark:text-text_secondary-dark hover:text-text_primary-light dark:hover:text-text_primary-dark"
                >
                  <HiX size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="p-5 space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    Order Status
                  </label>
                  <select
                    id="status"
                    value={statusForm}
                    onChange={(e) => setStatusForm(e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateStatusMutation.isPending}
                    className="btn-primary"
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader size="sm" /> Updating...
                      </>
                    ) : (
                      <>
                        <HiCheck size={18} className="mr-1" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
