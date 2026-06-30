import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid, Box, Typography, Paper, Stack, Chip, Divider,
  Table, TableBody, TableCell, TableHead, TableRow, alpha,
} from '@mui/material'
import {
  Business, People, Star, AutoAwesome,
  TrendingUp, TrendingDown, ArrowForward,
} from '@mui/icons-material'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { adminService, businessService } from '@/services'
import { PageHeader, SectionCard } from '@/components/common/UI'

const PURPLE = '#7C3AED'
const PIE_COLORS = ['#7C3AED', '#A855F7', '#C4B5FD', '#EDE9FE']

const MOCK_GROWTH = [
  { month: 'Jan', businesses: 12, users: 45 },
  { month: 'Feb', businesses: 18, users: 67 },
  { month: 'Mar', businesses: 25, users: 92 },
  { month: 'Apr', businesses: 31, users: 118 },
  { month: 'May', businesses: 40, users: 145 },
  { month: 'Jun', businesses: 52, users: 187 },
]

const MOCK_PLANS = [
  { name: 'Free', value: 42 },
  { name: 'Starter', value: 28 },
  { name: 'Pro', value: 18 },
  { name: 'Enterprise', value: 12 },
]

function StatCard({ icon, title, value, sub, color = PURPLE, trend }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider',
        background: '#fff', position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        },
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: `0 8px 24px ${alpha(color, 0.12)}` },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#0F172A' }}>
            {value ?? '—'}
          </Typography>
          {sub && (
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
              {trend === 'up' ? <TrendingUp sx={{ fontSize: 14, color: '#10B981' }} /> : trend === 'down' ? <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} /> : null}
              <Typography variant="caption" sx={{ color: trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : 'text.disabled' }}>
                {sub}
              </Typography>
            </Stack>
          )}
        </Box>
        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
        </Box>
      </Stack>
    </Paper>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <Paper sx={{ p: 1.5, minWidth: 130 }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary">{label}</Typography>
      {payload.map(p => (
        <Stack key={p.name} direction="row" justifyContent="space-between" spacing={2}>
          <Typography variant="caption" color="text.secondary">{p.name}</Typography>
          <Typography variant="caption" fontWeight={700} color={p.color}>{p.value}</Typography>
        </Stack>
      ))}
    </Paper>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentBusinesses, setRecentBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      adminService.getStats(),
      businessService.getAll(),
    ]).then(([statsR, bizR]) => {
      if (statsR.value) setStats(statsR.value.data)
      if (bizR.value) {
        const all = bizR.value.data || []
        setRecentBusinesses(all.slice(0, 5))
      }
    }).finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: <Business />, title: 'Total Businesses', value: stats?.totalBusinesses, sub: '+5 this week', trend: 'up', color: PURPLE },
    { icon: <People />, title: 'Total Users', value: stats?.totalUsers, sub: '+12 this week', trend: 'up', color: '#2563EB' },
    { icon: <Star />, title: 'Active Subscriptions', value: stats?.activeSubscription, sub: 'Paying customers', color: '#D97706' },
    { icon: <AutoAwesome />, title: 'AI Requests Today', value: stats?.aiRequests, sub: 'Across all businesses', color: '#10B981' },
  ]

  return (
    <Box sx={{ animation: 'fadeUp 0.35s ease both' }}>
      <PageHeader title="Admin Dashboard" subtitle="System-wide overview & statistics" />

      {/* ── Stat Cards ─────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map(s => (
          <Grid size={{ xs:12, sm:6, xl:3 }} key={s.title}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* ── Charts Row ─────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Growth Chart */}
        <Grid size={{ xs:12, lg:8 }}>
          <SectionCard title="Platform Growth" action={<Chip label="Last 6 months" size="small" variant="outlined" sx={{ fontWeight: 600, borderColor: '#7C3AED', color: '#7C3AED' }} />}>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={MOCK_GROWTH}>
                <defs>
                  <linearGradient id="biz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="usr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="businesses" name="Businesses" stroke={PURPLE} strokeWidth={2.5} fill="url(#biz)" />
                <Area type="monotone" dataKey="users" name="Users" stroke="#2563EB" strokeWidth={2.5} fill="url(#usr)" />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>

        {/* Plan Distribution */}
        <Grid size={{ xs:12, lg:4 }}>
          <SectionCard title="Subscription Plans">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={MOCK_PLANS} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {MOCK_PLANS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <RTooltip formatter={(v, n) => [`${v} businesses`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>
      </Grid>

      {/* ── Bottom Row ─────────────────────────────────── */}
      <Grid container spacing={2.5}>
        {/* Recent Businesses */}
        <Grid size={{ xs:12, lg:7 }}>
          <SectionCard
            title="Recent Businesses"
            action={
              <Chip
                label="View all" size="small" clickable
                onClick={() => navigate('/admin/businesses')}
                icon={<ArrowForward sx={{ fontSize: '14px !important' }} />}
                sx={{ fontWeight: 600, color: PURPLE, borderColor: PURPLE }}
                variant="outlined"
              />
            }
          >
            {loading ? (
              <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: 'center' }}>Loading…</Typography>
            ) : recentBusinesses.length === 0 ? (
              <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: 'center' }}>No businesses registered yet</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Business', 'Owner', 'Plan', 'Joined'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBusinesses.map((b, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{b.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{b.ownerName || '—'}</TableCell>
                      <TableCell><Chip label={b.subscriptionPlan || 'Free'} size="small" color="secondary" sx={{ fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionCard>
        </Grid>

        {/* AI Usage Stats */}
        <Grid size={{ xs:12, lg:5 }}>
          <SectionCard title="AI Usage by Feature">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={[
                { feature: 'Insights', count: 145 },
                { feature: 'Email', count: 87 },
                { feature: 'Marketing', count: 63 },
                { feature: 'Invoice', count: 41 },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={65} />
                <RTooltip formatter={(v) => [`${v} requests`, 'Count']} />
                <Bar dataKey="count" name="Requests" fill={PURPLE} radius={[0, 5, 5, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}