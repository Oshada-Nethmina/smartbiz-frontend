import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Visibility } from '@mui/icons-material'
import { invoiceService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, SectionCard } from '@/components/common/UI'

export default function InvoiceList() {
    const { business } = useBusiness(); const navigate = useNavigate()
    const [invoices, setInvoices] = useState([]); const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (business?.id) invoiceService.getAll(business.id).then(r => setInvoices(r.data)).finally(() => setLoading(false))
    }, [business])

    const columns = [
        { key: 'id', label: 'Invoice #', render: (v) => `#${v}` },
        { key: 'customerName', label: 'Customer' },
        { key: 'totalAmount', label: 'Total', render: (v) => `LKR ${Number(v || 0).toLocaleString()}` },
        { key: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Tooltip title="View Invoice"><IconButton size="small" onClick={() => navigate(`/invoices/${row.id}`)}><Visibility fontSize="small" /></IconButton></Tooltip>
            )
        },
    ]

    return (
        <Box>
            <PageHeader title="Invoices" subtitle={`${invoices.length} invoices generated`} />
            <SectionCard><DataTable columns={columns} data={invoices} loading={loading} /></SectionCard>
        </Box>
    )
}