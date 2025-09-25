import React, { useState } from 'react'
import BookManagement from './BookManagement'
import UserManagement from './UserManagement'
import OrderManagement from './OrderManagement'
import { motion } from 'framer-motion'
import {
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineChartBar
} from 'react-icons/hi'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/services/api'
import Loader from '@/components/Loader'
import Alert from '@/components/Alert'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'users' | 'orders'>('overview')

  const handleTabChange = (tab: 'overview' | 'books' | 'users' | 'orders') => {
    setActiveTab(tab)
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-0 overflow-hidden sticky top-24">
            <div className="p-4 bg-primary-light/10 dark:bg-primary-dark/10 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-display text-lg font-bold text-primary-light dark:text-primary-dark">
                Management
              </h2>
            </div>

            <div className="flex flex-col p-2">
              <NavButton
                active={activeTab === 'overview'}
                icon={<HiOutlineChartBar />}
                label="Overview"
                onClick={() => handleTabChange('overview')}
              />
              <NavButton
                active={activeTab === 'books'}
                icon={<HiOutlineBookOpen />}
                label="Books"
                onClick={() => handleTabChange('books')}
              />
              <NavButton
                active={activeTab === 'users'}
                icon={<HiOutlineUsers />}
                label="Users"
                onClick={() => handleTabChange('users')}
              />
              <NavButton
                active={activeTab === 'orders'}
                icon={<HiOutlineShoppingCart />}
                label="Orders"
                onClick={() => handleTabChange('orders')}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-4">
          {/* Wrap each tab content in error boundaries */}
          {activeTab === 'overview' && (
            <ErrorBoundary fallback={<AdminContentError title="Overview" />}>
              <OverviewDashboard />
            </ErrorBoundary>
          )}
          {activeTab === 'books' && (
            <ErrorBoundary fallback={<AdminContentError title="Book Management" />}>
              <BookManagement />
            </ErrorBoundary>
          )}
          {activeTab === 'users' && (
            <ErrorBoundary fallback={<AdminContentError title="User Management" />}>
              <UserManagement />
            </ErrorBoundary>
          )}
          {activeTab === 'orders' && (
            <ErrorBoundary fallback={<AdminContentError title="Order Management" />}>
              <OrderManagement />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  )
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error('Error in component:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Fallback error component for admin sections
const AdminContentError = ({ title }: { title: string }) => (
  <div className="card p-6">
    <h2 className="section-title">{title}</h2>
    <Alert
      type="error"
      message={`There was an error loading the ${title.toLowerCase()} content. Please try refreshing the page or contact support.`}
    />
  </div>
)

// Navigation Button Component
interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left mb-1 transition-colors ${
      active 
        ? 'bg-primary-light dark:bg-primary-dark text-white font-medium' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </motion.button>
)

// Dashboard Overview Component with Stats Cards
const OverviewDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => ordersApi.all().then(r => r.data)
  })

  if (isLoading) return <Loader />
  if (isError) return <Alert message="Failed to load orders" type="error" />

  const orders = data ?? []

  return (
    <div className="space-y-6">
      <h2 className="section-title">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={String(orders.length)}
          change="+12%"
          icon={<HiOutlineShoppingCart className="text-accent-light dark:text-accent-dark" size={24} />}
        />
        <StatCard
          title="Active Users"
          value="1,204"
          change="+8%"
          icon={<HiOutlineUsers className="text-secondary-light dark:text-secondary-dark" size={24} />}
        />
        <StatCard
          title="Books Inventory"
          value="486"
          change="+22"
          icon={<HiOutlineBookOpen className="text-primary-light dark:text-primary-dark" size={24} />}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem
            title="New order #1082"
            description="Order placed for 3 books"
            time="2 hours ago"
          />
          <ActivityItem
            title="Inventory updated"
            description="10 new books added to inventory"
            time="5 hours ago"
          />
          <ActivityItem
            title="User registration"
            description="5 new users registered today"
            time="Yesterday"
          />
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <div className="card p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-text_secondary-light dark:text-text_secondary-dark text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs mt-1 text-green-600 dark:text-green-400">{change}</p>
      </div>
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
        {icon}
      </div>
    </div>
  </div>
)

// Activity Item Component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time }) => (
  <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-800">
    <div className="w-2 h-2 mt-2 rounded-full bg-primary-light dark:bg-primary-dark mr-3"></div>
    <div className="flex-1">
      <p className="font-medium">{title}</p>
      <p className="text-text_secondary-light dark:text-text_secondary-dark text-sm">{description}</p>
    </div>
    <div className="text-text_secondary-light dark:text-text_secondary-dark text-sm">{time}</div>
  </div>
)
