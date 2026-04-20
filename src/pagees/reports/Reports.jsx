import React, { useState, useEffect } from 'react'
import { Box, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { reportService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, SectionCard } from '@/components/common/UI'

const COLORS = ['#1B4FD8', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const MOCK_SALES = [
    { label: 'Week 1', revenue: 45000, expenses: 18000 },
    { label: 'Week 2', revenue: 62000, expenses: 22000 },
    { label: 'Week 3', revenue: 38000, expenses: 15000 },
    { label: 'Week 4', revenue: 71000, expenses: 28000 },
]
const MOCK_PROFIT = [
    { name: 'Electronics', value: 35 },
    { name: 'Food', value: 25 },
    { name: 'Clothing', value: 20 },
    { name: 'Other', value: 20 },
]

export default function Reports() {
    const { business } = useBusiness()
    const [period, setPeriod] = useState('monthly')
    const [salesData, setSalesData] = useState(MOCK_SALES)
    const [profitData, setProfitData] = useState(MOCK_PROFIT)

    useEffect(() => {
        if (!business?.id) return
        Promise.allSettled([
            reportService.getSalesReport(business.id, { period }),
            reportService.getProfitReport(business.id, { period }),
        ]).then(([s, p]) => {
            if (s.value?.data?.data) setSalesData(s.value.data.data)
            if (p.value?.data?.data) setProfitData(p.value.data.data)
        })
    }, [business, period])

    return (
        <Box>
            <PageHeader
                title="Reports & Analytics"
                subtitle="Visualize your business performance"
                action={
                    <ToggleButtonGroup value={period} exclusive size="small" onChange={(_, v) => v && setPeriod(v)}>
                        {['weekly', 'monthly', 'yearly'].map(p => (
                            <ToggleButton key={p} value={p} sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: 13, px: 2 }}>
                                {p}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                }
            />

            <Grid container spacing={2.5}>
                <Grid item xs={12} lg={8}>
                    <SectionCard title="Revenue vs Expenses">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontFamily: '"Plus Jakarta Sans"' }}
                                    formatter={(v, name) => [`LKR ${Number(v).toLocaleString()}`, name]}
                                />
                                <Legend wrapperStyle={{ fontFamily: '"Plus Jakarta Sans"', fontSize: 13 }} />
                                <Bar dataKey="revenue" name="Revenue" fill="#1B4FD8" radius={[5, 5, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[5, 5, 0, 0]} opacity={0.85} />
                            </BarChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <SectionCard title="Revenue by Category">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={profitData} dataKey="value" nameKey="name" cx="50%" cy="46%" outerRadius={100} paddingAngle={3}>
                                    {profitData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontFamily: '"Plus Jakarta Sans"' }} formatter={(v) => [`${v}%`]} />
                                <Legend wrapperStyle={{ fontFamily: '"Plus Jakarta Sans"', fontSize: 13 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </SectionCard>
                </Grid>
            </Grid>
        </Box>
    )
}
