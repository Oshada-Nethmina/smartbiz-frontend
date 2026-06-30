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

export default function Subscription() {
    const { business } = useBusiness()
    const [plans, setPlans] = useState([])
    const [current, setCurrent] = useState(null)
    const [loading, setLoading] = useState('')

    useEffect(() => {
        subscriptionService
            .getPlans()
            .then((r) => {
                console.log("Plans:", r.data);
                setPlans(r.data);
            })
            .catch(console.error);

        if (business?.id) {
            subscriptionService
                .getByBusiness(business.id)
                .then((r) => setCurrent(r.data))
                .catch(console.error);
        }
    }, [business]);

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

            <Grid 
                container 
                spacing={2.5} 
                justifyContent="center"
                alignItems="stretch"
            >
                {plans.map((plan) => {

                    const isActive =
                        current?.planId === plan.planId ||
                        current?.planName === plan.name;

                    const isLoading = loading === String(plan.planId);

                    const isPopular = plan.name === "Pro";

                    const features = [
                        `${plan.maxUsers} Users`,
                        `${plan.maxProducts} Products`,
                        ...(plan.aiEnabled ? ["AI Assistant"] : []),
                        ...(plan.advancedReports ? ["Advanced Reports"] : []),
                        ...(plan.emailSupport ? ["Email Support"] : []),
                        ...(plan.prioritySupport ? ["Priority Support"] : []),
                    ];

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={plan.planId}>
                            <Paper
                                sx={{
                                    p: { xs: 3, lg: 3.5 }, height: '100%', position: 'relative',
                                    borderRadius: 4,
                                    border: '2px solid',
                                    borderColor: isPopular ? 'primary.main' : 'divider',
                                    background: isPopular ? 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' : '#ffffff',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isPopular ? '0 12px 24px -10px rgba(0, 99, 255, 0.2)' : '0 4px 12px rgba(0,0,0,0.02)',
                                    '&:hover': { transform: 'translateY(-6px)', boxShadow: isPopular ? '0 16px 32px -12px rgba(0, 99, 255, 0.3)' : '0 12px 24px rgba(0,0,0,0.06)' },
                                }}
                            >
                                {isPopular && (
                                    <Chip
                                        label="Most Popular"
                                        color="primary"
                                        size="small"
                                        sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontWeight: 800, px: 1, py: 0.5, height: 'auto', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 99, 255, 0.3)' }}
                                    />
                                )}

                                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Fraunces", serif', mb: 1, color: isPopular ? 'primary.main' : 'text.primary' }}>{plan.name}</Typography>
                                <Stack direction="row" alignItems="baseline" spacing={0.5} my={2} flexWrap="wrap">
                                    <Typography variant="h4" fontWeight={900} sx={{ fontFamily: '"Inter", "Roboto", sans-serif', color: 'text.primary', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                                        LKR {Number(plan.price).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" fontWeight={500}>/month</Typography>
                                </Stack>

                                <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />

                                <List dense disablePadding sx={{ flex: 1 }}>
                                    {features.map(feature => (
                                        <ListItem key={feature} disableGutters disablePadding sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 28 }}>
                                                <CheckCircle sx={{ fontSize: 18, color: isPopular ? 'primary.main' : 'success.main' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={feature}
                                                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: 'text.secondary' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                <Button
                                    fullWidth
                                    variant={isActive ? 'outlined' : isPopular ? 'contained' : 'outlined'}
                                    color={isActive ? 'success' : 'primary'}
                                    disabled={isActive || isLoading}
                                    onClick={() => handleSubscribe(plan.planId, plan.name)}
                                    sx={{ mt: 3, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '1rem', borderWidth: isActive ? 2 : 1, '&:hover': { borderWidth: isActive ? 2 : 1 } }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : isActive ? '✓ Current Plan' : 'Subscribe'}
                                </Button>
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
