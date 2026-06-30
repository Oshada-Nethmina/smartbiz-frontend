import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, IconButton, Tooltip, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { expenseService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, SectionCard, ConfirmDialog } from '@/components/common/UI'
import ExpenseForm from './ExpenseForm'
import toast from 'react-hot-toast'

export default function ExpenseList() {
    const { business } = useBusiness(); const navigate = useNavigate()
    const [expenses, setExpenses] = useState([]); const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState(null); const [deleting, setDeleting] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const fetchExpenses = () => {
        if (business?.id) {
            setLoading(true)
            expenseService.getAll(business.id).then(r => setExpenses(r.data)).finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [business])

    const handleDelete = async () => {
        setDeleting(true)
        try { await expenseService.delete(deleteId); setExpenses(e => e.filter(x => x.id !== deleteId)); toast.success('Expense deleted'); setDeleteId(null) }
        finally { setDeleting(false) }
    }

    const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)

    const columns = [
        { key: 'date', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
        { key: 'category', label: 'Category', render: (v) => <Chip label={v || 'Other'} size="small" color="warning" /> },
        { key: 'amount', label: 'Amount', render: (v) => `LKR ${Number(v || 0).toLocaleString()}` },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
            )
        },
    ]

    return (
        <Box>
            <PageHeader title="Expenses" subtitle={`Total: LKR ${total.toLocaleString()}`}
                action={<Button variant="contained" startIcon={<Add />} onClick={() => setIsFormOpen(true)}>Add Expense</Button>} />
            <SectionCard><DataTable columns={columns} data={expenses} loading={loading} /></SectionCard>
            <ConfirmDialog open={!!deleteId} title="Delete Expense" message="Delete this expense record?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />

            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth keepMounted={false} disableRestoreFocus>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Record Expense</DialogTitle>
                <DialogContent dividers>
                    <ExpenseForm
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={() => {
                            setIsFormOpen(false)
                            fetchExpenses()
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}