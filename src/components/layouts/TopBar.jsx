import React from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Typography, Stack, Chip, IconButton, Tooltip, alpha } from '@mui/material'
import { Notifications, LightMode } from '@mui/icons-material'
import { useBusiness } from '@/context/BusinessContext'
import { useAuth }     from '@/context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':          'Dashboard',
  '/sales':              'Sales',
  '/invoices':           'Invoices',
  '/customers':          'Customers',
  '/suppliers':          'Suppliers',
  '/products':           'Products & Inventory',
  '/expenses':           'Expenses',
  '/reports':            'Reports & Analytics',
  '/ai':                 'AI Assistant',
  '/subscription':       'Subscription',
  '/admin':              'Admin Panel',
  '/admin/businesses':   'All Businesses',
  '/admin/users':        'All Users',
}


export default function MainLayout({ children }) {
    const { pathname } = useLocation()
  const { business } = useBusiness()
  const { user }     = useAuth()

  const base  = '/' + pathname.split('/')[1]
  const title = PAGE_TITLES[pathname] || PAGE_TITLES[base] || 'SmartBiz'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    return (
        <Box
            component="header"
            sx={{
                height: 64,
                background: '#fff',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3.5,
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Left */}
            <Box>
                <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, lineHeight: 1 }}>
                    {title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>{today}</Typography>
            </Box>

            {/* Right */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
                {business && (
                    <Chip
                        label={business.name}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, borderColor: 'divider', color: 'text.secondary', '& .MuiChip-label': { px: 1.5 } }}
                        icon={
                            <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', ml: 1 }} />
                        }
                    />
                )}
                <Tooltip title="Notifications">
                    <IconButton size="small" sx={{ background: alpha('#1B4FD8', 0.06), '&:hover': { background: alpha('#1B4FD8', 0.12) } }}>
                        <Notifications fontSize="small" sx={{ color: 'text.secondary' }} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    )
}