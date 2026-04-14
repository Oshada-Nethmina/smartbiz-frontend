import React, { useEffect, useState } from 'react'
import { Box, Chip } from '@mui/material'
import { businessService } from '@/services'
import { PageHeader, DataTable, SectionCard } from '@/components/common/UI'

export default function AdminBusinesses() {
    const [businesses, setBusinesses] = useState([]); const [loading, setLoading] = useState(true)
    useEffect(() => { businessService.getAll().then(r => setBusinesses(r.data)).finally(() => setLoading(false)) }, [])

    const columns = [
        { key: 'name', label: 'Business Name' },
        { key: 'ownerName', label: 'Owner' },
        { key: 'subscriptionPlan', label: 'Plan', render: (v) => <Chip label={v || 'Free'} size="small" color="info" /> },
        { key: 'createdAt', label: 'Joined', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    ]

    return (
        <Box>
            <PageHeader title="All Businesses" subtitle={`${businesses.length} businesses`} />
            <SectionCard><DataTable columns={columns} data={businesses} loading={loading} /></SectionCard>
        </Box>
    )
}