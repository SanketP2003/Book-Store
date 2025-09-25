import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/services/api'
import Loader from '@/components/Loader'
import Alert from '@/components/Alert'
import { formatCurrency, formatDate, imageUrl } from '@/utils/format'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiOutlineShoppingBag,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClipboardCheck,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineCreditCard
} from 'react-icons/hi'

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
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
}

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.myOrders().then(r => r.data)
  })

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  // Toggle order details expansion
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  // Get status icon based on order status
  const getStatusIcon = (status: string) => {
    switch(status.toUpperCase()) {
      case 'PENDING':
        return <HiOutlineClipboardCheck className="text-accent-light dark:text-accent-dark" size={24} />
      case 'PROCESSING':
        return <HiOutlineShoppingBag className="text-secondary-light dark:text-secondary-dark" size={24} />
      case 'SHIPPED':
        return <HiOutlineTruck className="text-primary-light dark:text-primary-dark" size={24} />
      case 'DELIVERED':
        return <HiOutlineCheckCircle className="text-success-light dark:text-success-dark" size={24} />
      case 'CANCELLED':
        return <HiOutlineExclamationCircle className="text-error-light dark:text-error-dark" size={24} />
      default:
        return <HiOutlineClipboardCheck className="text-text_secondary-light dark:text-text_secondary-dark" size={24} />
    }
  }

  // Get status badge color based on order status
  const getStatusBadgeClass = (status: string) => {
    switch(status.toUpperCase()) {
      case 'PENDING':
        return 'bg-accent-light/20 text-accent-light dark:bg-accent-dark/20 dark:text-accent-dark'
      case 'PROCESSING':
        return 'bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark'
      case 'SHIPPED':
        return 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark'
      case 'DELIVERED':
        return 'bg-success-light/20 text-success-light dark:bg-success-dark/20 dark:text-success-dark'
      case 'CANCELLED':
        return 'bg-error-light/20 text-error-light dark:bg-error-dark/20 dark:text-error-dark'
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-text_secondary-light dark:text-text_secondary-dark'
    }
  }

  if (isLoading) return <Loader label="Loading your orders..." />
  if (isError) return <div className="page-container"><Alert message="Failed to load orders" type="error" /></div>

  const orders: Order[] = data || []

  return (
    <div className="page-container py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-title"
      >
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <div className="flex justify-center mb-6">
            <HiOutlineShoppingBag className="w-20 h-20 text-text_secondary-light dark:text-text_secondary-dark opacity-50" />
          </div>
          <p className="text-xl text-text_secondary-light dark:text-text_secondary-dark mb-6">You haven't placed any orders yet.</p>
          <Link to="/books" className="btn-primary inline-flex items-center gap-2 text-lg">
            Explore Books
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hidden sm:flex">
                    {getStatusIcon(order.status)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text_primary-light dark:text-text_primary-dark">
                        Order #{order.id}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-text_secondary-light dark:text-text_secondary-dark">
                      <div className="flex items-center gap-1">
                        <HiOutlineCalendar size={16} />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                      <div>
                        <span className="font-medium">{order.items.length}</span> {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                  <div className="text-right">
                    <span className="text-sm text-text_secondary-light dark:text-text_secondary-dark">Total</span>
                    <p className="font-bold text-lg text-primary-light dark:text-primary-dark">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <div className="text-text_secondary-light dark:text-text_secondary-dark">
                    {expandedOrderId === order.id ? (
                      <HiOutlineChevronUp size={20} />
                    ) : (
                      <HiOutlineChevronDown size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4">
                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                            Shipping Address
                          </h4>
                          <div className="flex items-start gap-1">
                            <HiOutlineLocationMarker className="mt-1 flex-shrink-0 text-text_secondary-light dark:text-text_secondary-dark" size={16} />
                            <p className="text-text_primary-light dark:text-text_primary-dark">
                              {order.shippingAddress || 'Address not provided'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                            Payment Method
                          </h4>
                          <div className="flex items-center gap-1">
                            <HiOutlineCreditCard className="text-text_secondary-light dark:text-text_secondary-dark" size={16} />
                            <p className="text-text_primary-light dark:text-text_primary-dark">
                              {order.paymentMethod || 'Payment method not specified'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                            Order Date
                          </h4>
                          <p className="text-text_primary-light dark:text-text_primary-dark">
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <h4 className="font-medium text-lg mb-3">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <Link to={`/books/${item.bookId}`}>
                              <img
                                src={imageUrl(item.image)}
                                alt={item.title}
                                className="w-12 h-16 object-cover rounded shadow-sm"
                              />
                            </Link>
                            <div className="flex-grow">
                              <Link
                                to={`/books/${item.bookId}`}
                                className="font-medium hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                              >
                                {item.title}
                              </Link>
                              <div className="text-sm text-text_secondary-light dark:text-text_secondary-dark">
                                {formatCurrency(item.price)} × {item.quantity}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-end">
                          <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between text-text_secondary-light dark:text-text_secondary-dark">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(order.totalAmount * 0.9)}</span>
                            </div>
                            <div className="flex justify-between text-text_secondary-light dark:text-text_secondary-dark">
                              <span>Shipping & Tax:</span>
                              <span>{formatCurrency(order.totalAmount * 0.1)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total:</span>
                              <span className="text-primary-light dark:text-primary-dark">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Call to action */}
                      {order.status === 'DELIVERED' && (
                        <div className="mt-6 flex justify-end">
                          <Link to={`/books`} className="btn-accent">
                            Buy Again
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
