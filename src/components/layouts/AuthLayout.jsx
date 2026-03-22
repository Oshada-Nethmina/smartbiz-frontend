import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Box, Typography, Stack, alpha } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
const FEATURES = [
  'AI-powered business insights',
  'Invoice & sales management',
  'Real-time inventory tracking',
  'Customer & supplier CRM',
  'Financial reporting & analytics',
]

export default function AuthLayout() {
   
    const { isAuthenticated } = useAuth()
    if (isAuthenticated()) return <Navigate to="/dashboard" replace />

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            {/* ── Left Panel ────────────────────────────── */}
            <Box
                sx={{
                    flex: 1,
                    background: '#0F172A',
                    backgroundImage: 'radial-gradient(ellipse at 60% 35%, rgba(27,79,216,0.35) 0%, transparent 65%)',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: 7, py: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* decorative circles */}
                {[500, 380, 260].map((size, i) => (
                    <Box key={i} sx={{
                        position: 'absolute',
                        width: size, height: size,
                        borderRadius: '50%',
                        border: `1px solid rgba(255,255,255,${0.03 + i * 0.02})`,
                        bottom: -size * 0.4, right: -size * 0.3,
                        pointerEvents: 'none',
                    }} />
                ))}

                {/* Brand */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 7 }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: 2,
                        background: 'linear-gradient(135deg, #1B4FD8 0%, #4B73E0 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 16, color: '#fff',
                    }}>
                        SB
                    </Box>
                    <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 20, color: '#fff' }}>
                        SmartBiz
                    </Typography>
                </Stack>

                {/* Tagline */}
                <Box sx={{ mb: 5 }}>
                    <Typography
                        sx={{
                            fontFamily: '"Fraunces", serif',
                            fontSize: 'clamp(32px, 4vw, 52px)',
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.15,
                            mb: 2,
                        }}
                    >
                        Run your business,<br />
                        <Box component="span" sx={{ color: '#4B73E0' }}>smarter.</Box>
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
                        The all-in-one platform for modern SMEs — with AI-powered insights built in.
                    </Typography>
                </Box>

                {/* Features */}
                <Stack spacing={1.5}>
                    {FEATURES.map((f) => (
                        <Stack key={f} direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{
                                width: 22, height: 22, borderRadius: '50%',
                                background: alpha('#1B4FD8', 0.3),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#4B73E0', fontSize: 12, fontWeight: 800, flexShrink: 0,
                            }}>
                                ✓
                            </Box>
                            <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>{f}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </Box>

            {/* ── Right Form Panel ──────────────────────── */}
            <Box
                sx={{
                    width: { xs: '100%', md: 480 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, md: 5 },
                    background: '#F1F5FB',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}