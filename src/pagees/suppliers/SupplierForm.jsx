import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Grid, TextField, Button, Stack, CircularProgress } from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { supplierService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

export default function SupplierForm() {
    const { id } = useParams(); const navigate = useNavigate(); const { business } = useBusiness()
    const isEdit = !!id
    const [form, setForm] = useState({ name: '', email: '', phone: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => { if (isEdit) supplierService.getById(id).then(r => setForm({ name: r.data.name, email: r.data.email || '', phone: r.data.phone || '' })) }, [id])
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            const payload = { ...form, businessId: business.id }
            if (isEdit) await supplierService.update(id, payload); else await supplierService.create(payload)
            toast.success(`Supplier ${isEdit ? 'updated' : 'created'}`); navigate('/suppliers')
        } finally { setLoading(false) }
    }

    return (
        <Box sx={{ maxWidth: 580 }}>
            <PageHeader title={isEdit ? 'Edit Supplier' : 'New Supplier'} action={<Button startIcon={<ArrowBack />} onClick={() => navigate('/suppliers')}>Back</Button>} />
            <SectionCard>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}><TextField label="Supplier Name" name="name" value={form.name} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth /></Grid>
                    </Grid>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />} disabled={loading}>
                            {isEdit ? 'Update' : 'Create'} Supplier
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/suppliers')}>Cancel</Button>
                    </Stack>
                </Box>
            </SectionCard>
        </Box>
    )
}