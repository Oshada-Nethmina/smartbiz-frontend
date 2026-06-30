import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Paper, Box, Typography, Stack, Chip, Button, Divider, alpha } from '@mui/material'
import { ArrowForward, Warning } from '@mui/icons-material'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { salesService, financeService, productService, customerService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { StatCard, SectionCard } from '@/components/common/UI'

const MOCK_CHART = [
    { month: 'Aug', revenue: 120000, expenses: 45000 },
    { month: 'Sep', revenue: 98000, expenses: 38000 },
    { month: 'Oct', revenue: 145000, expenses: 52000 },
    { month: 'Nov', revenue: 132000, expenses: 48000 },
    { month: 'Dec', revenue: 187000, expenses: 61000 },
    { month: 'Jan', revenue: 156000, expenses: 55000 },
]

const fmt = (n) => `LKR ${Number(n || 0).toLocaleString()}`

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <Paper sx={{ p: 1.5, minWidth: 140 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary">{label}</Typography>
            {payload.map((p) => (
                <Stack key={p.name} direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="caption" color="text.secondary">{p.name}</Typography>
                    <Typography variant="caption" fontWeight={700} color={p.color}>LKR {Number(p.value).toLocaleString()}</Typography>
                </Stack>
            ))}
        </Paper>
    )
}

export default function Dashboard() {
    const { business } = useBusiness()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [chartData, setChartData] = useState(MOCK_CHART)
    const [recentSales, setRecentSales] = useState([])
    const [lowStock, setLowStock] = useState([])

    useEffect(() => {
        if (!business?.id) return
        const id = business.id
        Promise.allSettled([
            salesService.getSummary(id, 'monthly'),
            financeService.getSummary(id, 'monthly'),
            customerService.getAll(id),
            productService.getLowStock(id),
        ]).then(([salesR, expR, custR, stockR]) => {
            const sales = salesR.value?.data || {}
            const exp = expR.value?.data || {}
            const custs = custR.value?.data || []
            setStats({
                totalRevenue: sales.totalRevenue || 0,
                totalExpenses: exp.total || 0,
                netProfit: (sales.totalRevenue || 0) - (exp.total || 0),
                totalCustomers: custs.length,
                revenueChange: sales.change || 0,
                expenseChange: exp.change || 0,
            })
            setChartData(sales.chartData || MOCK_CHART)
            setRecentSales(sales.recentSales || [])
            setLowStock(stockR.value?.data || [])
        })
    }, [business])

    return (
        <Box sx={{ animation: 'fadeUp 0.35s ease both' }}>
            {/* ── Stats ─────────────────────────────────── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {[
                    { title: 'Total Revenue', value: fmt(stats?.totalRevenue), change: stats?.revenueChange, icon: '💰', color: 'primary' },
                    { title: 'Total Expenses', value: fmt(stats?.totalExpenses), change: stats?.expenseChange, icon: '💸', color: 'error' },
                    { title: 'Net Profit', value: fmt(stats?.netProfit), icon: '📈', color: 'success' },
                    { title: 'Total Customers', value: stats?.totalCustomers ?? '—', icon: '👥', color: 'secondary' },
                ].map((s) => (
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={s.title}>
                        <StatCard {...s} />
                    </Grid>
                ))}
            </Grid>

            {/* ── Charts ─────────────────────────────────── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <SectionCard title="Revenue Overview" action={
                        <Chip label="Last 6 months" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    }>
                        <ResponsiveContainer width="100%" height={230}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#rv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <SectionCard title="Monthly Expenses">
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[5, 5, 0, 0]} opacity={0.85} />
                            </BarChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Grid>
            </Grid>

            {/* ── Bottom ─────────────────────────────────── */}
            <Grid container spacing={2.5}>
                {/* Recent Sales */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <SectionCard
                        title="Recent Sales"
                        action={
                            <Button size="small" endIcon={<ArrowForward fontSize="small" />} onClick={() => navigate('/sales')}>
                                View all
                            </Button>
                        }
                    >
                        {recentSales.length === 0 ? (
                            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>No sales yet</Typography>
                        ) : recentSales.slice(0, 5).map((s, i) => (
                            <Box key={i}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{s.customerName || 'Walk-in'}</Typography>
                                        <Typography variant="caption" color="text.disabled">{s.date}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Chip label={s.paymentMethod || 'Cash'} size="small" color="info" />
                                        <Typography variant="body2" fontWeight={700}>{fmt(s.total)}</Typography>
                                    </Stack>
                                </Stack>
                                {i < 4 && <Divider />}
                            </Box>
                        ))}
                    </SectionCard>
                </Grid>

                {/* Low Stock */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <SectionCard
                        title={<Stack direction="row" spacing={1} alignItems="center"><Warning sx={{ color: 'warning.main', fontSize: 18 }} /><span>Low Stock Alerts</span></Stack>}
                    >
                        {lowStock.length === 0 ? (
                            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>✅ All products well stocked</Typography>
                        ) : lowStock.map((p, i) => (
                            <Box key={i}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                                        <Typography variant="caption" color="text.disabled">{p.category}</Typography>
                                    </Box>
                                    <Chip
                                        label={`${p.quantity} left`}
                                        size="small"
                                        color={p.quantity <= 5 ? 'error' : 'warning'}
                                    />
                                </Stack>
                                {i < lowStock.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </SectionCard>
                </Grid>
            </Grid>
        </Box>
    )
}
