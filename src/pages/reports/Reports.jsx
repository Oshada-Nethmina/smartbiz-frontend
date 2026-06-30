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

const MOCK_SALES = {
    weekly: [
        { label: 'Week 1', revenue: 45000, expenses: 18000 },
        { label: 'Week 2', revenue: 62000, expenses: 22000 },
        { label: 'Week 3', revenue: 38000, expenses: 15000 },
        { label: 'Week 4', revenue: 71000, expenses: 28000 },
    ],
    monthly: [
        { label: 'Jan', revenue: 120000, expenses: 45000 },
        { label: 'Feb', revenue: 150000, expenses: 50000 },
        { label: 'Mar', revenue: 98000, expenses: 38000 },
        { label: 'Apr', revenue: 165000, expenses: 60000 },
        { label: 'May', revenue: 140000, expenses: 55000 },
        { label: 'Jun', revenue: 180000, expenses: 70000 },
    ],
    yearly: [
        { label: '2023', revenue: 1200000, expenses: 450000 },
        { label: '2024', revenue: 1500000, expenses: 500000 },
        { label: '2025', revenue: 980000, expenses: 380000 },
        { label: '2026', revenue: 1650000, expenses: 600000 },
    ]
}

const MOCK_PROFIT = {
    weekly: [
        { name: 'Electronics', value: 35 },
        { name: 'Food', value: 25 },
        { name: 'Clothing', value: 20 },
        { name: 'Other', value: 20 },
    ],
    monthly: [
        { name: 'Electronics', value: 40 },
        { name: 'Food', value: 30 },
        { name: 'Clothing', value: 15 },
        { name: 'Other', value: 15 },
    ],
    yearly: [
        { name: 'Electronics', value: 45 },
        { name: 'Food', value: 20 },
        { name: 'Clothing', value: 25 },
        { name: 'Other', value: 10 },
    ]
}

export default function Reports() {
    const { business } = useBusiness()
    const [period, setPeriod] = useState('monthly')
    const [salesData, setSalesData] = useState(MOCK_SALES.monthly)
    const [profitData, setProfitData] = useState({
        revenue: 0,
        expenses: 0,
        profit: 0,
        margin: 0,
        chartData: MOCK_PROFIT.monthly
    })

    useEffect(() => {
        if (!business?.id) return

        // Immediately set mock data for the selected period
        setSalesData(MOCK_SALES[period] || MOCK_SALES.monthly)
        setProfitData({
            revenue: 0,
            expenses: 0,
            profit: 0,
            margin: 0,
            chartData: MOCK_PROFIT[period] || MOCK_PROFIT.monthly
        })

        Promise.allSettled([
            reportService.getSalesReport(business.id, period),
            reportService.getProfitReport(business.id, period),
        ]).then(([s, p]) => {
            console.log("Sales Result:", s);
            console.log("Profit Result:", p);

            if (p.status === "fulfilled") {
                console.log("Profit:", p.value.data);

                if (p.value.data.chartData && p.value.data.chartData.length > 0) {
                    setProfitData(p.value.data);
                }
            }

            if (s.status === "fulfilled") {
                console.log("Sales:", s.value.data);

                if (s.value.data.chartData && s.value.data.chartData.length > 0) {
                    setSalesData(s.value.data.chartData);
                }
            }
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
                <Grid size={{ xs: 12, lg: 8 }}>
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

                <Grid size={{ xs: 12, lg: 4 }}>
                    <SectionCard title="Revenue by Category">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={profitData.chartData} dataKey="value" nameKey="name" cx="50%" cy="46%" outerRadius={100} paddingAngle={3}>
                                    {profitData.chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
