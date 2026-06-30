import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '@/services'

const AuthContext = createContext(null)

function parseAuthResponse(data) {
  const token = data?.token;

  // Support multiple backend response formats
  const rawUser =
    data?.userResponse ||
    data?.user ||
    data;

  const role = (rawUser?.role || rawUser?.userRole || rawUser?.type || 'USER')
    .toString()
    .toUpperCase();

  return {
    token,
    user: {
      ...rawUser,
      role,
    },
  };
}


// ──────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('sb_user')
      const storedToken = localStorage.getItem('sb_token')

      if (storedUser && storedUser !== 'undefined' && storedToken) {
        const parsed = JSON.parse(storedUser)
        // Re-normalize role in case old data was stored without normalization
        parsed.role = (parsed.role || 'USER').toString().toUpperCase()
        setUser(parsed)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Auth restore error:', err)
      localStorage.removeItem('sb_token')
      localStorage.removeItem('sb_user')
      setUser(null)
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)

    const { token, user } = parseAuthResponse(res.data)

    if (!token || !user?.role) {
      throw new Error('Invalid authentication response')
    }

    localStorage.setItem('sb_token', token)
    localStorage.setItem('sb_user', JSON.stringify(user))

    setUser(user)
    return user;
  }

  const register = async (data) => {
    await authService.register(data);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_user')
    setUser(null)
  }

  // Case-insensitive admin check — works with 'ADMIN', 'admin', 'Admin'
  const isAdmin = () => user?.role?.toUpperCase() === 'ADMIN'
  const isAuthenticated = () => !!user


  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}