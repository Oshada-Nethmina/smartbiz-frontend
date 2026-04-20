import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Grid, TextField, Button, Stack, CircularProgress, MenuItem } from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { productService, supplierService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

export default function ProductForm() {
    const { id } = useParams(); const navigate = useNavigate(); const { business } = useBusiness()
    const isEdit = !!id
    const [form, setForm] = useState({ name: '', category: '', cost: '', quantity: '', supplierId: '' })
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (business?.id) supplierService.getAll(business.id).then(r => setSuppliers(r.data))
        if (isEdit) productService.getById(id).then(r => setForm({ name: r.data.name, category: r.data.category || '', cost: r.data.cost || '', quantity: r.data.quantity || '', supplierId: r.data.supplierId || '' }))
    }, [id, business])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            const payload = { ...form, businessId: business.id, cost: Number(form.cost), quantity: Number(form.quantity) }
            if (isEdit) await productService.update(id, payload); else await productService.create(payload)
            toast.success(`Product ${isEdit ? 'updated' : 'created'}`); navigate('/products')
        } finally { setLoading(false) }
    }

    return (
        <Box sx={{ maxWidth: 640 }}>
            <PageHeader title={isEdit ? 'Edit Product' : 'New Product'} action={<Button startIcon={<ArrowBack />} onClick={() => navigate('/products')}>Back</Button>} />
            <SectionCard>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}><TextField label="Product Name" name="name" value={form.name} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={6} sm={3}><TextField label="Cost (LKR)" name="cost" type="number" value={form.cost} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={6} sm={3}><TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12}>
                            <TextField select label="Supplier (Optional)" name="supplierId" value={form.supplierId} onChange={handleChange} fullWidth>
                                <MenuItem value="">No supplier</MenuItem>
                                {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />} disabled={loading}>
                            {isEdit ? 'Update' : 'Create'} Product
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/products')}>Cancel</Button>
                    </Stack>
                </Box>
            </SectionCard>
        </Box>
    )
}