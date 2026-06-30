import React, { useState } from 'react'
import {
  Box, Grid, Paper, Typography, Stack, Chip, Button, Divider,
  Switch, List, ListItem, ListItemIcon, ListItemText, alpha,
} from '@mui/material'
import { Check, Star, Rocket, Business, Edit } from '@mui/icons-material'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

const PURPLE = '#7C3AED'

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    color: '#64748B',
    icon: <Star />,
    features: [
      'Up to 50 products',
      'Up to 100 customers',
      'Basic sales tracking',
      'Basic reports',
      '5 AI requests/month',
    ],
    businesses: 42,
    status: 'active',
  },
  {
    key: 'starter',
    name: 'Starter',
    price: 999,
    color: '#2563EB',
    icon: <Rocket />,
    popular: true,
    features: [
      'Up to 500 products',
      'Unlimited customers',
      'Full sales & invoice management',
      'Advanced reports',
      '50 AI requests/month',
      'Email AI generator',
    ],
    businesses: 28,
    status: 'active',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 2499,
    color: PURPLE,
    icon: <Business />,
    features: [
      'Unlimited products',
      'Unlimited customers',
      'Full platform access',
      'Priority support',
      '200 AI requests/month',
      'All AI features',
      'Custom reports',
    ],
    businesses: 18,
    status: 'active',
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    color: '#D97706',
    icon: <Star />,
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Unlimited AI requests',
      'API access',
      'White-label option',
      'SLA guarantee',
    ],
    businesses: 12,
    status: 'active',
  },
]

function PlanCard({ plan }) {
  const [enabled, setEnabled] = useState(plan.status === 'active')

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3, borderRadius: 3,
        border: '2px solid',
        borderColor: plan.popular ? plan.color : 'divider',
        background: plan.popular ? alpha(plan.color, 0.02) : '#fff',
        position: 'relative', overflow: 'hidden',
        '&::before': plan.popular ? {
          content: '"POPULAR"',
          position: 'absolute', top: 12, right: -20,
          background: plan.color, color: '#fff',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
          px: 4, py: 0.4,
          transform: 'rotate(40deg)',
        } : {},
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: `0 8px 24px ${alpha(plan.color, 0.15)}` },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
            <Box sx={{ color: plan.color }}>{React.cloneElement(plan.icon, { sx: { fontSize: 20, color: plan.color } })}</Box>
            <Typography fontWeight={800} fontSize={17} color="#0F172A">{plan.name}</Typography>
          </Stack>
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography fontWeight={800} fontSize={26} sx={{ color: plan.color }}>
              {plan.price === 0 ? 'Free' : `LKR ${plan.price.toLocaleString()}`}
            </Typography>
            {plan.price > 0 && <Typography variant="caption" color="text.secondary">/month</Typography>}
          </Stack>
        </Box>
        <Stack alignItems="flex-end" spacing={0.5}>
          <Chip label={`${plan.businesses} businesses`} size="small" sx={{ bgcolor: alpha(plan.color, 0.1), color: plan.color, fontWeight: 700 }} />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" color="text.secondary">{enabled ? 'Active' : 'Disabled'}</Typography>
            <Switch size="small" checked={enabled} onChange={() => { setEnabled(!enabled); toast.success(`${plan.name} plan ${!enabled ? 'enabled' : 'disabled'}`) }} sx={{ '& .MuiSwitch-thumb': { bgcolor: plan.color } }} />
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <List dense disablePadding>
        {plan.features.map((f, i) => (
          <ListItem key={i} disablePadding sx={{ py: 0.3 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Check sx={{ fontSize: 14, color: plan.color }} />
            </ListItemIcon>
            <ListItemText primary={f} primaryTypographyProps={{ fontSize: 13, color: '#374151' }} />
          </ListItem>
        ))}
      </List>

      <Button
        startIcon={<Edit />}
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mt: 2, borderColor: plan.color, color: plan.color, '&:hover': { borderColor: plan.color, bgcolor: alpha(plan.color, 0.06) } }}
        onClick={() => toast.success(`Editing ${plan.name} plan...`)}
      >
        Edit Plan
      </Button>
    </Paper>
  )
}

export default function AdminSubscriptions() {
  return (
    <Box sx={{ animation: 'fadeUp 0.35s ease both' }}>
      <PageHeader
        title="Subscription Plans"
        subtitle="Manage pricing tiers and plan availability"
        action={
          <Button variant="contained" sx={{ bgcolor: PURPLE, '&:hover': { bgcolor: '#6D28D9' } }}>
            Add New Plan
          </Button>
        }
      />

      {/* ── Summary ───────────────────────────────── */}
      <SectionCard sx={{ mb: 3 }}>
        <Grid container spacing={2} textAlign="center">
          {[
            { label: 'Total Subscriptions', value: 100, color: '#64748B' },
            { label: 'Paying Customers', value: 58, color: PURPLE },
            { label: 'Monthly Revenue (LKR)', value: '147,522', color: '#10B981' },
            { label: 'Avg. Revenue per User', value: '2,543', color: '#D97706' },
          ].map(s => (
            <Grid size={{ xs:6, sm:3 }} key={s.label}>
              <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      {/* ── Plan Cards ────────────────────────────── */}
      <Grid container spacing={2.5}>
        {PLANS.map(plan => (
          <Grid size={{ xs:12, sm:6, xl:3 }} key={plan.key}>
            <PlanCard plan={plan} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
