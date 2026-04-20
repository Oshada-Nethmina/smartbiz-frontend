import React, { useEffect, useState } from 'react'
import {
    Box, Grid, Typography, Button, Stack, Chip, Divider,
    CircularProgress, Paper, List, ListItem, ListItemIcon, ListItemText, Alert,
} from '@mui/material'
import { CheckCircle, Star } from '@mui/icons-material'
import { subscriptionService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader } from '@/components/common/UI'
import toast from 'react-hot-toast'

const MOCK_PLANS = [
    { id: 1, name: 'Basic', price: 990, features: ['5 Users', '100 Products', 'Basic Reports', 'Email Support'] },
    { id: 2, name: 'Pro', price: 2490, popular: true, features: ['20 Users', 'Unlimited Products', 'AI Assistant', 'Advanced Reports', 'Priority Support'] },
    { id: 3, name: 'Enterprise', price: 5990, features: ['Unlimited Users', 'All Pro Features', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee'] },
]

export default function Subscription() {
    const { business } = useBusiness()
    const [plans, setPlans] = useState(MOCK_PLANS)
    const [current, setCurrent] = useState(null)
    const [loading, setLoading] = useState('')

    useEffect(() => {
        subscriptionService.getPlans().then(r => setPlans(r.data)).catch(() => { })
        if (business?.id) subscriptionService.getByBusiness(business.id).then(r => setCurrent(r.data)).catch(() => { })
    }, [business])

    const handleSubscribe = async (planId, planName) => {
        setLoading(String(planId))
        try {
            await subscriptionService.subscribe({ businessId: business.id, planId, planName })
            toast.success('Subscription updated!')
            subscriptionService.getByBusiness(business.id).then(r => setCurrent(r.data)).catch(() => { })
        } finally { setLoading('') }
    }

    return (
        <Box>
            <PageHeader title="Subscription Plans" subtitle="Choose the best plan for your business" />

            {current && (
                <Alert severity="success" icon={<Star />} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700}>Active Plan: {current.planName}</Typography>
                            <Typography variant="body2">Renews: {current.endDate ? new Date(current.endDate).toLocaleDateString() : '—'}</Typography>
                        </Box>
                        <Chip label={current.status} color="success" size="small" />
                    </Stack>
                </Alert>
            )}

            <Grid container spacing={3} justifyContent="center">
                {plans.map((plan) => {
                    const isActive = current?.planId === plan.id || current?.planName === plan.name
                    const isLoading = loading === String(plan.id)

                    return (
                        <Grid item xs={12} sm={6} md={4} key={plan.id}>
                            <Paper
                                sx={{
                                    p: 3.5, height: '100%', position: 'relative',
                                    border: plan.popular ? '2px solid' : '1px solid',
                                    borderColor: plan.popular ? 'primary.main' : 'divider',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                                }}
                            >
                                {plan.popular && (
                                    <Chip
                                        label="Most Popular"
                                        color="primary"
                                        size="small"
                                        sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontWeight: 700, px: 1 }}
                                    />
                                )}

                                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Fraunces", serif' }}>{plan.name}</Typography>
                                <Stack direction="row" alignItems="flex-end" spacing={0.5} my={2}>
                                    <Typography variant="h3" fontWeight={900} sx={{ fontFamily: '"Fraunces", serif', color: 'primary.main', lineHeight: 1 }}>
                                        LKR {Number(plan.price).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={0.5}>/month</Typography>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <List dense disablePadding sx={{ flex: 1 }}>
                                    {(plan.features || []).map((f) => (
                                        <ListItem key={f} disableGutters disablePadding sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 28 }}>
                                                <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={f} primaryTypographyProps={{ fontSize: 14 }} />
                                        </ListItem>
                                    ))}
                                </List>

                                <Button
                                    fullWidth
                                    variant={isActive ? 'outlined' : plan.popular ? 'contained' : 'outlined'}
                                    color={isActive ? 'success' : 'primary'}
                                    disabled={isActive || isLoading}
                                    onClick={() => handleSubscribe(plan.id, plan.name)}
                                    sx={{ mt: 3 }}
                                >
                                    {isLoading ? <CircularProgress size={18} color="inherit" /> : isActive ? '✓ Current Plan' : 'Subscribe'}
                                </Button>
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
