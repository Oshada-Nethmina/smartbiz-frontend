import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, IconButton, Tooltip, Chip } from '@mui/material'
import { Add, Visibility } from '@mui/icons-material'
import { salesService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, SectionCard } from '@/components/common/UI'

export default function SalesList() {
  const { business } = useBusiness(); const navigate = useNavigate()
  const [sales, setSales] = useState([]); const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (business?.id) salesService.getAll(business.id).then(r => setSales(r.data)).finally(() => setLoading(false))
  }, [business])

  const columns = [
    { key: 'salesDate', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'customerName', label: 'Customer' },
    { key: 'totalAmount', label: 'Total', render: (v) => `LKR ${Number(v||0).toLocaleString()}` },
    { key: 'paymentMethod', label: 'Payment', render: (v) => <Chip label={v||'Cash'} size="small" color="info"/> },
    { key: 'actions', label: '', render: (_, row) => (
      <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/sales/${row.id}`)}><Visibility fontSize="small"/></IconButton></Tooltip>
    )},
  ]

  return (
    <Box>
      <PageHeader title="Sales" subtitle={`${sales.length} total sales`}
        action={<Button variant="contained" startIcon={<Add/>} onClick={() => navigate('/sales/new')}>New Sale</Button>}/>
      <SectionCard><DataTable columns={columns} data={sales} loading={loading}/></SectionCard>
    </Box>
  )
}