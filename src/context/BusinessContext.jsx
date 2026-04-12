import React, { createContext, useContext, useState, useEffect } from 'react'
import { businessService } from '@/services'
import { useAuth } from './AuthContext'

const BusinessContext = createContext(null)

export function BusinessProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [business, setBusiness]   = useState(null)
  const [loading,  setLoading]    = useState(false)

  useEffect(() => {
    if (isAuthenticated() && user?.businessId) fetchBusiness(user.businessId)
  }, [user])

  const fetchBusiness = async (id) => {
    try {
      setLoading(true)
      const res = await businessService.getById(id)
      setBusiness(res.data)
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const updateBusiness = (data) => setBusiness(prev => ({ ...prev, ...data }))

  return (
    <BusinessContext.Provider value={{ business, loading, fetchBusiness, updateBusiness }}>
      {children}
    </BusinessContext.Provider>
  )
}

export const useBusiness = () => useContext(BusinessContext)
