import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Grid, TextField, Button, Stack, CircularProgress } from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { customerService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

export default function CustomerForm({ onClose, onSuccess, customerId }) {
    const { id: paramId } = useParams()
    const navigate = useNavigate()
    const { business } = useBusiness()
    const id = customerId || paramId
    const isEdit = !!id

    const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', address: '' })
    const [loading, setLoading] = useState(false)

    const handleCancel = () => {
        if (onClose) onClose()
        else navigate('/customers')
    }

    useEffect(() => {
        if (!isEdit || !id) return;

        customerService
            .getById(id)
            .then(r =>
                setForm({
                    name: r.data.name,
                    email: r.data.email || '',
                    phoneNumber: r.data.phone || '',
                    address: r.data.address || '',
                })
            )
            .catch(handleCancel);
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!business?.id) {
            toast.error('No business selected. Please select a business first.')
            return
        }
        setLoading(true)
        try {
            const payload = { ...form, businessId: business.id }
            if (isEdit) await customerService.update(id, payload)
            else await customerService.create(payload)
            toast.success(`Customer ${isEdit ? 'updated' : 'created'}`)
            if (onSuccess) onSuccess()
            else navigate('/customers')
        } finally { setLoading(false) }
    }

    return (
        <Box sx={{ maxWidth: 640 }}>
            {!onClose && (
                <PageHeader
                    title={isEdit ? 'Edit Customer' : 'New Customer'}
                    action={<Button startIcon={<ArrowBack />} onClick={handleCancel}>Back</Button>}
                />
            )}
            <SectionCard>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12 }}>
                            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth multiline rows={2} />
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />} disabled={loading}>
                            {isEdit ? 'Update Customer' : 'Create Customer'}
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                    </Stack>
                </Box>
            </SectionCard>
        </Box>
    )
}
