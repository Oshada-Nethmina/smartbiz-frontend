import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Grid, TextField, Button, Stack, CircularProgress, MenuItem,
    Table, TableHead, TableBody, TableRow, TableCell, IconButton, Tooltip,
    Typography, Paper, Divider,
} from '@mui/material'
import { Add, Delete, Save, ArrowBack } from '@mui/icons-material'
import { salesService, customerService, productService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { useAuth } from '@/context/AuthContext'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

const emptyItem = { productId: '', quantity: 1, price: 0, subtotal: 0 }

export default function SalesForm({ onClose, onSuccess }) {
    const navigate = useNavigate()
    const { business } = useBusiness()
    const { user } = useAuth()

    const [form, setForm] = useState({ customerId: '', paymentMethod: 'CASH', salesDate: new Date().toISOString().split('T')[0] })
    const [items, setItems] = useState([{ ...emptyItem }])
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (business?.id) {
            customerService.getAll(business.id).then(r => setCustomers(r.data))
            productService.getAll(business.id).then(r => setProducts(r.data))
        }
    }, [business])

    const updateItem = (i, field, value) => {
        const newItems = items.map((item, idx) => {
            if (idx !== i) return item
            const updated = { ...item, [field]: value }
            if (field === 'productId') {
                const prod = products.find(p => String(p.id) === String(value))
                if (prod) { updated.price = prod.cost; updated.subtotal = prod.cost * updated.quantity }
            }
            if (field === 'quantity' || field === 'price') {
                updated.subtotal = Number(updated.price) * Number(updated.quantity)
            }
            return updated
        })
        setItems(newItems)
    }

    const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))
    const addItem = () => setItems([...items, { ...emptyItem }])
    const total = items.reduce((s, item) => s + (Number(item.subtotal) || 0), 0)

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            const payload = {
                ...form,
                businessId: business.id,
                userId: user?.id,
                totalAmount: total,
                items: items.map(it => ({
                    productId: Number(it.productId),
                    quantity: Number(it.quantity),
                    price: Number(it.price),
                    subtotal: Number(it.subtotal),
                })),
            }
            await salesService.create(payload)
            toast.success('Sale created successfully!')
            if (onSuccess) {
                onSuccess()
            } else {
                navigate('/sales')
            }
        } finally { setLoading(false) }
    }

    const handleCancel = () => {
        if (onClose) {
            onClose()
        } else {
            navigate('/sales')
        }
    }

    return (
        <Box sx={{ maxWidth: 860 }}>
            {!onClose && (
                <PageHeader
                    title="New Sale"
                    action={<Button startIcon={<ArrowBack />} onClick={handleCancel}>Back</Button>}
                />
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>

                    {/* ── Sale Info ─────────────────────────── */}
                    <SectionCard title="Sale Details">
                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField select label="Customer" name="customerId" value={form.customerId}
                                    onChange={e => setForm({ ...form, customerId: e.target.value })} fullWidth>
                                    <MenuItem value="">Walk-in Customer</MenuItem>
                                    {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField select label="Payment Method" name="paymentMethod" value={form.paymentMethod}
                                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })} fullWidth>
                                    {['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE'].map(m => <MenuItem key={m} value={m}>{m.replace('_', ' ')}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField label="Sale Date" name="salesDate" type="date" value={form.salesDate}
                                    onChange={e => setForm({ ...form, salesDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                        </Grid>
                    </SectionCard>

                    {/* ── Items ─────────────────────────────── */}
                    <SectionCard
                        title="Items"
                        action={<Button size="small" startIcon={<Add />} onClick={addItem}>Add Row</Button>}
                    >
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Product', 'Qty', 'Unit Price (LKR)', 'Subtotal', ''].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ minWidth: 220 }}>
                                                <TextField select size="small" value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)} fullWidth>
                                                    <MenuItem value="">Select product</MenuItem>
                                                    {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                                </TextField>
                                            </TableCell>
                                            <TableCell sx={{ width: 80 }}>
                                                <TextField type="number" size="small" value={item.quantity} inputProps={{ min: 1 }} onChange={e => updateItem(i, 'quantity', e.target.value)} fullWidth />
                                            </TableCell>
                                            <TableCell sx={{ width: 140 }}>
                                                <TextField type="number" size="small" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} fullWidth />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>
                                                    LKR {Number(item.subtotal || 0).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ width: 48 }}>
                                                {items.length > 1 && (
                                                    <Tooltip title="Remove">
                                                        <IconButton size="small" color="error" onClick={() => removeItem(i)}>
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                            <Typography variant="body1" fontWeight={700} color="text.secondary">Total Amount</Typography>
                            <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ fontFamily: '"Fraunces", serif' }}>
                                LKR {total.toLocaleString()}
                            </Typography>
                        </Stack>
                    </SectionCard>

                    <Stack direction="row" spacing={1.5}>
                        <Button type="submit" variant="contained" size="large"
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                            disabled={loading}>
                            Create Sale & Invoice
                        </Button>
                        <Button variant="outlined" size="large" onClick={handleCancel}>Cancel</Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}
