import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Stack, Tooltip, IconButton, alpha,
} from '@mui/material'
import {
  Dashboard, Business, SupervisedUserCircle,
  BarChart, Star, ChevronLeft, ChevronRight, Logout,
  AdminPanelSettings, QueryStats,
} from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'

const SIDEBAR_W  = 258
const SIDEBAR_SM = 70

const ADMIN_NAV = [
  { to: '/admin',                icon: <Dashboard fontSize="small" />,           label: 'Dashboard'     },
  { to: '/admin/businesses',     icon: <Business fontSize="small" />,            label: 'Businesses'    },
  { to: '/admin/users',          icon: <SupervisedUserCircle fontSize="small" />, label: 'All Users'     },
  { to: '/admin/subscriptions',  icon: <Star fontSize="small" />,                label: 'Subscriptions' },
  { to: '/admin/ai-usage',       icon: <QueryStats fontSize="small" />,          label: 'AI Usage'      },
  { to: '/admin/reports',        icon: <BarChart fontSize="small" />,            label: 'Usage Reports'  },
]

export default function AdminSideBar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const W = collapsed ? SIDEBAR_SM : SIDEBAR_W

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <Box
      component="aside"
      sx={{
        width: W, minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D1B2A 0%, #1A0A2E 100%)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* ── Brand ─────────────────────────────────── */}
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        sx={{ px: collapsed ? 1.5 : 2.5, py: 2.5, minHeight: 72, borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Box
          sx={{
            minWidth: 38, height: 38, borderRadius: 2,
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AdminPanelSettings sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 17, color: '#fff', lineHeight: 1 }}>
              SmartBiz
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#A78BFA', mt: 0.3, fontWeight: 600, letterSpacing: '0.05em' }}>
              ADMIN PANEL
            </Typography>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: '#6B7280', ml: 'auto', flexShrink: 0, '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.07)' } }}
        >
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Stack>

      {/* ── Nav Items ─────────────────────────────── */}
      <List sx={{ flex: 1, py: 1.5, overflowY: 'auto', overflowX: 'hidden' }}>
        {ADMIN_NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/admin'} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Tooltip title={collapsed ? label : ''} placement="right">
                <ListItemButton
                  selected={isActive}
                  sx={{
                    mx: 1, borderRadius: 2, mb: 0.25,
                    color: isActive ? '#fff' : '#6B7280',
                    background: isActive ? 'linear-gradient(135deg, #7C3AED, #A855F7) !important' : 'transparent',
                    '&:hover': { background: 'rgba(255,255,255,0.06) !important', color: '#C4B5FD' },
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 1.5,
                    minHeight: 40,
                    boxShadow: isActive ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : 36, justifyContent: 'center' }}>
                    {icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ fontSize: 13.5, fontWeight: isActive ? 700 : 500, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </List>

      {/* ── User Footer ───────────────────────────── */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', p: collapsed ? 1 : 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 34, height: 34, flexShrink: 0,
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              fontSize: 13, fontWeight: 700,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Admin'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Administrator
              </Typography>
            </Box>
          )}
          <Tooltip title="Sign out">
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{ color: '#6B7280', flexShrink: 0, '&:hover': { color: '#EF4444', background: alpha('#EF4444', 0.1) } }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  )
}
