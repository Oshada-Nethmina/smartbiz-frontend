import React, { useEffect, useState } from 'react'
import { Box, Chip } from '@mui/material'
import { userService } from '@/services'
import { PageHeader, DataTable, SectionCard } from '@/components/common/UI'

export default function AdminUsers() {
    const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true)
    useEffect(() => { userService.getAll().then(r => setUsers(r.data)).finally(() => setLoading(false)) }, [])

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'businessName', label: 'Business' },
        { key: 'role', label: 'Role', render: (v) => <Chip label={v} size="small" color={v === 'ADMIN' ? 'error' : 'info'} /> },
        { key: 'createdAt', label: 'Joined', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    ]

    return (
        <Box>
            <PageHeader title="All Users" subtitle={`${users.length} users`} />
            <SectionCard><DataTable columns={columns} data={users} loading={loading} /></SectionCard>
        </Box>
    )
}