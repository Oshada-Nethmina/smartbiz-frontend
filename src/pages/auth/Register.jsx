import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box, Typography, TextField, Button, Alert,
    CircularProgress, Stack, Grid, InputAdornment, IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const BLUE = '#1B4FD8'
const BLUE_DARK = '#1540b0'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [role, setRole] = useState('OWNER')
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        phone: '', businessName: '', businessAddress: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            const payload = { ...form, role }
            delete payload.confirmPassword

            if (role === 'ADMIN') {
                delete payload.businessName
                delete payload.businessAddress
            }

            await register(payload)

            // If using react-hot-toast:
            toast.success('Registration successful. Please sign in.')

            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 3.5 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700 }}>
                    Create account
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Get started with SmartBiz
                </Typography>
            </Box>

            {/* ── Role Toggle Pill ──────────────────── */}
            <Box
                sx={{
                    display: 'flex',
                    background: '#E8EDF8',
                    borderRadius: 99,
                    p: '4px',
                    mb: 3,
                }}
            >
                {[
                    { key: 'OWNER', label: 'Business Owner' },
                    { key: 'ADMIN', label: 'Admin' },
                ].map(({ key, label }) => (
                    <Box
                        key={key}
                        onClick={() => setRole(key)}
                        sx={{
                            flex: 1, textAlign: 'center',
                            py: 0.9, borderRadius: 99, cursor: 'pointer',
                            fontWeight: 700, fontSize: 13.5,
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            transition: 'all 0.2s ease',
                            background: role === key
                                ? 'linear-gradient(135deg, #1B4FD8, #4B73E0)'
                                : 'transparent',
                            color: role === key ? '#fff' : '#64748B',
                            boxShadow: role === key
                                ? '0 2px 10px rgba(27,79,216,0.35)'
                                : 'none',
                            userSelect: 'none',
                        }}
                    >
                        {label}
                    </Box>
                ))}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                {/* Personal Info */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <TextField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />

                <TextField
                    label="Password" name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password} onChange={handleChange}
                    required fullWidth inputProps={{ minLength: 6 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPw(!showPw)}>
                                    {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Confirm Password" name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword} onChange={handleChange}
                    required fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Business fields — only for Business Owner */}
                {role === 'OWNER' && (
                    <>
                        <TextField label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} required fullWidth />
                        <TextField label="Business Address (optional)" name="businessAddress" value={form.businessAddress} onChange={handleChange} fullWidth />
                    </>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ mt: 0.5 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                </Button>
            </Stack>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                Already have an account?{' '}
                <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 700 }}>Sign in</Box>
            </Typography>
        </Box>
    )
}
