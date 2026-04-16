import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Button, Stack, Divider, CircularProgress } from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'
import { customerService } from '@/services'
import { PageHeader, SectionCard } from '@/components/common/UI'

const Row = ({ label, value }) => (
    <Box>
        <Stack direction="row" justifyContent="space-between" py={1.5}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.disabled' }}>{label}</Typography>
            <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
        </Stack>
        <Divider />
    </Box>
)

export default function CustomerDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [customer, setCustomer] = useState(null)

    useEffect(() => {
        customerService.getById(id).then(r => setCustomer(r.data)).catch(() => navigate('/customers'))
    }, [id])

    if (!customer) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

    return (
        <Box sx={{ maxWidth: 560 }}>
            <PageHeader
                title={customer.name}
                subtitle="Customer Profile"
                action={
                    <Stack direction="row" spacing={1}>
                        <Button startIcon={<ArrowBack />} onClick={() => navigate('/customers')}>Back</Button>
                        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/customers/${id}/edit`)}>Edit</Button>
                    </Stack>
                }
            />
            <SectionCard>
                <Row label="Full Name" value={customer.name} />
                <Row label="Email" value={customer.email} />
                <Row label="Phone" value={customer.phone} />
                <Row label="Address" value={customer.address} />
                <Row label="Added On" value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'} />
            </SectionCard>
        </Box>
    )
}
