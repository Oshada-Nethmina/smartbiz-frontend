import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, InputAdornment, Stack, IconButton, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Add, Search, Edit, Delete, Visibility } from '@mui/icons-material'
import { customerService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, StatusChip, SectionCard, ConfirmDialog } from '@/components/common/UI'
import CustomerForm from './CustomerForm'
import CustomerDetail from './CustomerDetail'
import toast from 'react-hot-toast'

export default function CustomerList() {
    const { business } = useBusiness()
    const navigate = useNavigate()
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [viewId, setViewId] = useState(null)

    const fetchCustomers = () => {
        if (business?.id) {
            setLoading(true)
            customerService.getAll(business.id).then(r => setCustomers(r.data)).finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [business])

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await customerService.delete(deleteId)
            setCustomers(c => c.filter(x => x.id !== deleteId))
            toast.success('Customer deleted')
            setDeleteId(null)
        } finally { setDeleting(false) }
    }

    const filtered = customers.filter(c =>
        [c.name, c.email, c.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    )

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'createdAt', label: 'Added', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
        {
            key: 'actions', label: '', width: 120,
            render: (_, row) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View"><IconButton size="small" onClick={() => setViewId(row.id)}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => {
                        console.log("Row =", row);
                        console.log("Row ID =", row.id);
                        console.log("Customer ID =", row.customerId);

                        setEditId(row.id);
                    }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </Stack>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader
                title="Customers"
                subtitle={`${customers.length} customers registered`}
                action={<Button variant="contained" startIcon={<Add />} onClick={() => setIsFormOpen(true)}>Add Customer</Button>}
            />
            <SectionCard>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        size="small"
                        sx={{ width: 320 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment> }}
                    />
                </Box>
                <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No customers found." />
            </SectionCard>

            <ConfirmDialog
                open={!!deleteId}
                title="Delete Customer"
                message="Are you sure you want to delete this customer? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />

            <Dialog open={isFormOpen || !!editId} onClose={() => { setIsFormOpen(false); setEditId(null) }} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>{editId ? 'Edit Customer' : 'New Customer'}</DialogTitle>
                <DialogContent dividers>
                    <CustomerForm
                        customerId={editId}
                        onClose={() => { setIsFormOpen(false); setEditId(null) }}
                        onSuccess={() => {
                            setIsFormOpen(false)
                            setEditId(null)
                            fetchCustomers()
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!viewId} onClose={() => setViewId(null)} maxWidth="sm" fullWidth>
                <DialogContent dividers sx={{ p: 0, '& .MuiBox-root': { maxWidth: '100%' } }}>
                    <CustomerDetail
                        customerId={viewId}
                        onClose={() => setViewId(null)}
                        onEdit={(id) => {
                            setViewId(null)
                            setEditId(id)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}
