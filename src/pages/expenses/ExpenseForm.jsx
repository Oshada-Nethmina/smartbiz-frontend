import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, TextField, Button, Stack, CircularProgress, MenuItem } from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { expenseService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { useAuth } from '@/context/AuthContext'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

const CATS = ['Rent', 'Utilities', 'Salaries', 'Inventory', 'Marketing', 'Transport', 'Maintenance', 'Other']

export default function ExpenseForm({ onClose, onSuccess }) {
    const navigate = useNavigate(); const { business } = useBusiness(); const { user } = useAuth()
    const [form, setForm] = useState({ amount: '', category: '', date: new Date().toISOString().split('T')[0], description: '' })
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleCancel = () => {
        if (onClose) onClose()
        else navigate('/expenses')
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            await expenseService.create({ ...form, amount: Number(form.amount), businessId: business.id, userId: user?.id })
            toast.success('Expense recorded'); 
            if (onSuccess) onSuccess()
            else navigate('/expenses')
        } finally { setLoading(false) }
    }

    return (
        <Box sx={{ maxWidth: 520 }}>
            {!onClose && <PageHeader title="Record Expense" action={<Button startIcon={<ArrowBack />} onClick={handleCancel}>Back</Button>} />}
            <SectionCard>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs:6 }}><TextField label="Amount (LKR)" name="amount" type="number" value={form.amount} onChange={handleChange} required fullWidth /></Grid>
                        <Grid size={{ xs:6 }}><TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} required fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid size={{ xs:12 }}>
                            <TextField select label="Category" name="category" value={form.category} onChange={handleChange} required fullWidth>
                                {CATS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs:12 }}><TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} /></Grid>
                    </Grid>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />} disabled={loading}>Record Expense</Button>
                        <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                    </Stack>
                </Box>
            </SectionCard>
        </Box>
    )
}