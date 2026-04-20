import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, InputAdornment, Stack, IconButton, Tooltip, Chip } from '@mui/material'
import { Add, Search, Edit, Delete } from '@mui/icons-material'
import { productService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, SectionCard, ConfirmDialog } from '@/components/common/UI'
import toast from 'react-hot-toast'

export default function ProductList() {
    const { business } = useBusiness(); const navigate = useNavigate()
    const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleteId, setDeleteId] = useState(null); const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (business?.id) productService.getAll(business.id).then(r => setProducts(r.data)).finally(() => setLoading(false))
    }, [business])

    const handleDelete = async () => {
        setDeleting(true)
        try { await productService.delete(deleteId); setProducts(p => p.filter(x => x.id !== deleteId)); toast.success('Product deleted'); setDeleteId(null) }
        finally { setDeleting(false) }
    }

    const filtered = products.filter(p => [p.name, p.category].some(v => v?.toLowerCase().includes(search.toLowerCase())))

    const columns = [
        { key: 'name', label: 'Product Name' },
        { key: 'category', label: 'Category' },
        { key: 'cost', label: 'Cost', render: (v) => `LKR ${Number(v || 0).toLocaleString()}` },
        {
            key: 'quantity', label: 'Stock', render: (v) => (
                <Chip label={v} size="small" color={v <= 5 ? 'error' : v <= 20 ? 'warning' : 'success'} />
            )
        },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/products/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </Stack>
            )
        },
    ]

    return (
        <Box>
            <PageHeader title="Products & Inventory" subtitle={`${products.length} products`}
                action={<Button variant="contained" startIcon={<Add />} onClick={() => navigate('/products/new')}>Add Product</Button>} />
            <SectionCard>
                <Box sx={{ mb: 2 }}>
                    <TextField placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} size="small" sx={{ width: 280 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment> }} />
                </Box>
                <DataTable columns={columns} data={filtered} loading={loading} />
            </SectionCard>
            <ConfirmDialog open={!!deleteId} title="Delete Product" message="Delete this product?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
        </Box>
    )
}