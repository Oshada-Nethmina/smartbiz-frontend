import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '@/components/layouts/MainLayout'
import AuthLayout from '@/components/layouts/AuthLayout'

// Guards
import PrivateRoute from '@/components/common/PrivateRoute'
import AdminRoute from '@/components/common/AdminRoute'

// Auth
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Dashboard
import Dashboard from '@/pages/dashboard/Dashboard'

// Customers
import CustomerList from '@/pages/customers/CustomerList'
import CustomerForm from '@/pages/customers/CustomerForm'
import CustomerDetail from '@/pages/customers/CustomerDetail'

// Suppliers
import SupplierList from '@/pages/suppliers/SupplierList'
import SupplierForm from '@/pages/suppliers/SupplierForm'

// Products
import ProductList from '@/pages/products/ProductList'
import ProductForm from '@/pages/products/ProductForm'

// Sales
import SalesList from '@/pages/sales/SalesList'
import SalesForm from '@/pages/sales/SalesForm'
import SalesDetail from '@/pages/sales/SalesDetail'

// Invoices
import InvoiceList from '@/pages/invoices/InvoiceList'
import InvoiceView from '@/pages/invoices/InvoiceView'

// Expenses
import ExpenseList from '@/pages/expenses/ExpenseList'
import ExpenseForm from '@/pages/expenses/ExpenseForm'

// Reports
import Reports from '@/pages/reports/Reports'

// AI
// import AIAssistant from '@/pages/ai/AIAssistant'

// Subscription
import Subscription from '@/pages/subscription/Subscription'

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminBusinesses from '@/pages/admin/AdminBusinesses'
import AdminUsers from '@/pages/admin/AdminUsers'

// Context
import { AuthProvider } from '@/context/AuthContext'
import { BusinessProvider } from '@/context/BusinessContext'

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <BrowserRouter>
          <Routes>

            {/* ── Public Auth Routes ─────────────────── */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* ── Protected Business Routes ──────────── */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />

              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/suppliers/new" element={<SupplierForm />} />
              <Route path="/suppliers/:id/edit" element={<SupplierForm />} />

              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />

              <Route path="/sales" element={<SalesList />} />
              <Route path="/sales/new" element={<SalesForm />} />
              <Route path="/sales/:id" element={<SalesDetail />} />

              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceView />} />

              <Route path="/expenses" element={<ExpenseList />} />
              <Route path="/expenses/new" element={<ExpenseForm />} />

              <Route path="/reports" element={<Reports />} />
              {/* <Route path="/ai" element={<AIAssistant />} /> */}
              <Route path="/subscription" element={<Subscription />} />
            </Route>

            {/* ── Admin Routes ───────────────────────── */}
            <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/businesses" element={<AdminBusinesses />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BusinessProvider>
    </AuthProvider>
  )
}
