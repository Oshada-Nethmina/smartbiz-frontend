import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, Alert, CircularProgress, Stack, Grid } from '@mui/material'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', businessName: '', businessAddress: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            await register(form)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally { setLoading(false) }
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

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>
                <TextField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth inputProps={{ minLength: 6 }} />
                <TextField label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} required fullWidth />
                <TextField label="Business Address (optional)" name="businessAddress" value={form.businessAddress} onChange={handleChange} fullWidth />

                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 0.5 }}>
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
