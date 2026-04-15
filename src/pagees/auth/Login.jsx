import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box, Typography, TextField, Button, Alert,
    CircularProgress, Stack, InputAdornment, IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const user = await login(form.email, form.password)
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.')
        } finally { setLoading(false) }
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700 }}>
                    Welcome back
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Sign in to your SmartBiz account
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

            <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
                <TextField
                    label="Email address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    placeholder="you@example.com"
                />
                <TextField
                    label="Password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    placeholder="••••••••"
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

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ mt: 0.5 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                </Button>
            </Stack>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Box component={Link} to="/register" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Create one
                </Box>
            </Typography>
        </Box>
    )
}
