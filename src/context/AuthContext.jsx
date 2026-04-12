import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '@/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser  = localStorage.getItem('sb_user')
    const storedToken = localStorage.getItem('sb_token')
    if (storedUser && storedToken) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    const { token, user: u } = res.data
    localStorage.setItem('sb_token', token)
    localStorage.setItem('sb_user',  JSON.stringify(u))
    setUser(u)
    return u
  }

  const register = async (data) => {
    const res = await authService.register(data)
    const { token, user: u } = res.data
    localStorage.setItem('sb_token', token)
    localStorage.setItem('sb_user',  JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_user')
    setUser(null)
  }

  const isAdmin         = ()  => user?.role === 'ADMIN'
  const isAuthenticated = ()  => !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
