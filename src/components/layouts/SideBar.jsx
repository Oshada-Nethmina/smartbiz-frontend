import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Stack, Tooltip, Divider, IconButton, alpha,
} from '@mui/material'
import {
  Dashboard, People, LocalShipping, Inventory2, PointOfSale,
  Receipt, MoneyOff, BarChart, AutoAwesome, Star,
  AdminPanelSettings, Business, SupervisedUserCircle,
  ChevronLeft, ChevronRight, Logout,
} from '@mui/icons-material'
import { useAuth }     from '@/context/AuthContext'
import { useBusiness } from '@/context/BusinessContext'

const SIDEBAR_W  = 258
const SIDEBAR_SM = 70

const NAV = [
  { to: '/dashboard', icon: <Dashboard fontSize="small" />,         label: 'Dashboard'    },
  { to: '/sales',     icon: <PointOfSale fontSize="small" />,       label: 'Sales'        },
  { to: '/invoices',  icon: <Receipt fontSize="small" />,           label: 'Invoices'     },
  { to: '/customers', icon: <People fontSize="small" />,            label: 'Customers'    },
  { to: '/suppliers', icon: <LocalShipping fontSize="small" />,     label: 'Suppliers'    },
  { to: '/products',  icon: <Inventory2 fontSize="small" />,        label: 'Products'     },
  { to: '/expenses',  icon: <MoneyOff fontSize="small" />,          label: 'Expenses'     },
  { to: '/reports',   icon: <BarChart fontSize="small" />,          label: 'Reports'      },
  { to: '/ai',        icon: <AutoAwesome fontSize="small" />,       label: 'AI Assistant' },
  { to: '/subscription', icon: <Star fontSize="small" />,           label: 'Subscription' },
]

const ADMIN_NAV = [
  { to: '/admin',             icon: <AdminPanelSettings fontSize="small" />, label: 'Admin Panel'  },
  { to: '/admin/businesses',  icon: <Business fontSize="small" />,           label: 'Businesses'   },
  { to: '/admin/users',       icon: <SupervisedUserCircle fontSize="small"/>, label: 'All Users'   },
]


export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { business } = useBusiness()
  const navigate = useNavigate()

  const W = collapsed ? SIDEBAR_SM : SIDEBAR_W
  const navItems = isAdmin ? [...NAV, ...ADMIN_NAV] : NAV

    const handleLogout = () => {
      logout(); navigate('/login') }

  return (
    <Box
      component="aside"
      sx={{
        width: W, minHeight: '100vh',
        background: '#0F172A',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
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
            background: 'linear-gradient(135deg, #1B4FD8 0%, #4B73E0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 15, color: '#fff',
            flexShrink: 0,
          }}
        >
          SB
        </Box>
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 17, color: '#fff', lineHeight: 1 }}>
              SmartBiz
            </Typography>
            {business && (
              <Typography sx={{ fontSize: 11, color: '#64748B', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {business.name}
              </Typography>
            )}
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: '#475569', ml: 'auto', flexShrink: 0, '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.07)' } }}
        >
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Stack>

      {/* ── Nav Items ─────────────────────────────── */}
      <List sx={{ flex: 1, py: 1.5, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Tooltip title={collapsed ? label : ''} placement="right">
                <ListItemButton
                  selected={isActive}
                  sx={{
                    mx: 1, borderRadius: 2, mb: 0.25,
                    color: isActive ? '#fff' : '#64748B',
                    background: isActive ? 'linear-gradient(135deg, #1B4FD8, #4B73E0) !important' : 'transparent',
                    '&:hover': { background: 'rgba(255,255,255,0.06) !important', color: '#CBD5E1' },
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 1.5,
                    minHeight: 40,
                    boxShadow: isActive ? '0 4px 12px rgba(27,79,216,0.35)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit', minWidth: collapsed ? 0 : 36,
                      justifyContent: 'center',
                    }}
                  >
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
              background: 'linear-gradient(135deg, #1B4FD8, #0EA5E9)',
              fontSize: 13, fontWeight: 700,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Guest User'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {user?.role || 'USER'}
              </Typography>
            </Box>
          )}
          <Tooltip title="Sign out">
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{ color: '#475569', flexShrink: 0, '&:hover': { color: '#EF4444', background: alpha('#EF4444', 0.1) } }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}