import React, { useEffect, useState } from 'react'
import { Grid, Box } from '@mui/material'
import { adminService } from '@/services'
import { PageHeader, StatCard } from '@/components/common/UI'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    useEffect(() => { adminService.getStats().then(r => setStats(r.data)).catch(() => { }) }, [])

    return (
        <Box>
            <PageHeader title="Admin Dashboard" subtitle="System-wide overview" />
            <Grid container spacing={2.5}>
                {[
                    { title: 'Total Businesses', value: stats?.totalBusinesses ?? '—', icon: '🏢', color: 'primary' },
                    { title: 'Total Users', value: stats?.totalUsers ?? '—', icon: '👥', color: 'secondary' },
                    { title: 'Active Subscriptions', value: stats?.activeSubscriptions ?? '—', icon: '⭐', color: 'warning' },
                    { title: 'AI Requests Today', value: stats?.aiRequestsToday ?? '—', icon: '✨', color: 'success' },
                ].map(s => (
                    <Grid item xs={12} sm={6} xl={3} key={s.title}><StatCard {...s} /></Grid>
                ))}
            </Grid>
        </Box>
    )
}