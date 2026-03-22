import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from './SideBar'
import Topbar  from './Topbar'

const SIDEBAR_W  = 258

export default function MainLayout({ children }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: 'background.default' }}>
            <Sidebar />
            <Box
                sx={{
                    flex: 1,
                    ml: `${SIDEBAR_W}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <Topbar />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: { xs: 2, md: 3.5 },
                        maxWidth: 1400,
                        width: '100%',
                        animation: 'fadeUp 0.3s ease both',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}