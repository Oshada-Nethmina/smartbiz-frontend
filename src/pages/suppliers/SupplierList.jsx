import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, IconButton, Tooltip } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { supplierService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, SectionCard, ConfirmDialog } from '@/components/common/UI'
import toast from 'react-hot-toast'

export default function SupplierList() {
    const { business } = useBusiness(); const navigate = useNavigate()
    const [suppliers, setSuppliers] = useState([]); const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState(null); const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (business?.id) supplierService.getAll(business.id).then(r => setSuppliers(r.data)).finally(() => setLoading(false))
    }, [business])

    const handleDelete = async () => {
        setDeleting(true)
        try { await supplierService.delete(deleteId); setSuppliers(s => s.filter(x => x.id !== deleteId)); toast.success('Supplier deleted'); setDeleteId(null) }
        finally { setDeleting(false) }
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/suppliers/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </Stack>
            )
        },
    ]

    return (
        <Box>
            <PageHeader title="Suppliers" subtitle={`${suppliers.length} suppliers`}
                action={<Button variant="contained" startIcon={<Add />} onClick={() => navigate('/suppliers/new')}>Add Supplier</Button>} />
            <SectionCard><DataTable columns={columns} data={suppliers} loading={loading} /></SectionCard>
            <ConfirmDialog open={!!deleteId} title="Delete Supplier" message="Delete this supplier?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
        </Box>
    )
}