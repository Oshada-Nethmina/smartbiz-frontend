import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout  from '@/components/layouts/MainLayout'
import AdminLayout from '@/components/layouts/AdminLayout'
import AuthLayout  from '@/components/layouts/AuthLayout'

// Guards
import PrivateRoute from '@/components/common/PrivateRoute'
import AdminRoute   from '@/components/common/AdminRoute'

// Auth
import Login    from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// ── Business Owner Pages ─────────────────────────────────
import Dashboard    from '@/pages/dashboard/Dashboard'
import CustomerList   from '@/pages/customers/CustomerList'
import CustomerForm   from '@/pages/customers/CustomerForm'
import CustomerDetail from '@/pages/customers/CustomerDetail'
import SupplierList   from '@/pages/suppliers/SupplierList'
import SupplierForm   from '@/pages/suppliers/SupplierForm'
import ProductList    from '@/pages/products/ProductList'
import ProductForm    from '@/pages/products/ProductForm'
import SalesList      from '@/pages/sales/SalesList'
import SalesForm      from '@/pages/sales/SalesForm'
import SalesDetail    from '@/pages/sales/SalesDetail'
import InvoiceList    from '@/pages/invoices/InvoiceList'
import InvoiceView    from '@/pages/invoices/InvoiceView'
import ExpenseList    from '@/pages/expenses/ExpenseList'
import ExpenseForm    from '@/pages/expenses/ExpenseForm'
import Reports        from '@/pages/reports/Reports'
import AIAssistant    from '@/pages/ai/AIAssistant'
import Subscription   from '@/pages/subscription/Subscription'

// ── Admin Pages ──────────────────────────────────────────
import AdminDashboard    from '@/pages/admin/AdminDashboard'
import AdminBusinesses   from '@/pages/admin/AdminBusinesses'
import AdminUsers        from '@/pages/admin/AdminUsers'
import AdminSubscriptions from '@/pages/admin/AdminSubscriptions'
import AdminAIUsage      from '@/pages/admin/AdminAIUsage'
import AdminReports      from '@/pages/admin/AdminReports'

// Context
import { AuthProvider }     from '@/context/AuthContext'
import { BusinessProvider } from '@/context/BusinessContext'

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <BrowserRouter>
          <Routes>

            {/* ── Public Auth Routes ─────────────────────── */}
            <Route element={<AuthLayout />}>
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* ── Business Owner Routes (User Dashboard) ──── */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/"           element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"  element={<Dashboard />} />

              <Route path="/customers"         element={<CustomerList />}   />
              <Route path="/customers/new"     element={<CustomerForm />}   />
              <Route path="/customers/:id"     element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />

              <Route path="/suppliers"          element={<SupplierList />} />
              <Route path="/suppliers/new"      element={<SupplierForm />} />
              <Route path="/suppliers/:id/edit" element={<SupplierForm />} />

              <Route path="/products"          element={<ProductList />} />
              <Route path="/products/new"      element={<ProductForm />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />

              <Route path="/sales"     element={<SalesList />}  />
              <Route path="/sales/new" element={<SalesForm />}  />
              <Route path="/sales/:id" element={<SalesDetail />} />

              <Route path="/invoices"    element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceView />} />

              <Route path="/expenses"    element={<ExpenseList />} />
              <Route path="/expenses/new" element={<ExpenseForm />} />

              <Route path="/reports"     element={<Reports />}      />
              <Route path="/ai"          element={<AIAssistant />}  />
              <Route path="/subscription" element={<Subscription />} />
            </Route>

            {/* ── Admin Routes (Admin Dashboard) ─────────── */}
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin"                element={<AdminDashboard />}    />
              <Route path="/admin/businesses"     element={<AdminBusinesses />}   />
              <Route path="/admin/users"          element={<AdminUsers />}         />
              <Route path="/admin/subscriptions"  element={<AdminSubscriptions />} />
              <Route path="/admin/ai-usage"       element={<AdminAIUsage />}      />
              <Route path="/admin/reports"        element={<AdminReports />}      />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BusinessProvider>
    </AuthProvider>
  )
}
