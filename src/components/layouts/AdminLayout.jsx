import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Typography, Stack, IconButton, Tooltip, alpha } from '@mui/material'
import { Notifications } from '@mui/icons-material'
import AdminSideBar from './AdminSideBar'

const SIDEBAR_W = 258

const PAGE_TITLES = {
  '/admin':               'Admin Dashboard',
  '/admin/businesses':    'All Businesses',
  '/admin/users':         'All Users',
  '/admin/subscriptions': 'Subscription Plans',
  '/admin/ai-usage':      'AI Usage Monitor',
  '/admin/reports':       'Usage Reports',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const base = pathname.split('/').slice(0, 3).join('/')
  const title = PAGE_TITLES[pathname] || PAGE_TITLES[base] || 'Admin Panel'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F5F3FF' }}>
      <AdminSideBar />
      <Box sx={{ flex: 1, ml: `${SIDEBAR_W}px`, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Topbar */}
        <Box
          component="header"
          sx={{
            height: 64, background: '#fff',
            borderBottom: '1px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 3.5, position: 'sticky', top: 0, zIndex: 100,
            borderLeft: '3px solid #7C3AED',
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, lineHeight: 1 }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>{today}</Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ background: alpha('#7C3AED', 0.06), '&:hover': { background: alpha('#7C3AED', 0.12) } }}>
                <Notifications fontSize="small" sx={{ color: '#7C3AED' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flex: 1, p: { xs: 2, md: 3.5 }, maxWidth: 1400, width: '100%', animation: 'fadeUp 0.3s ease both' }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
