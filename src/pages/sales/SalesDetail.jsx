import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Button, Stack, Chip, Divider, CircularProgress, Paper } from '@mui/material'
import { ArrowBack, Receipt } from '@mui/icons-material'
import { salesService } from '@/services'
import { PageHeader, SectionCard } from '@/components/common/UI'

export default function SalesDetail({ saleId, onClose }) {
    const { id: paramId } = useParams(); const navigate = useNavigate()
    const id = saleId || paramId
    console.log("saleId =", saleId);
    console.log("paramId =", paramId);
    const [sale, setSale] = useState(null)

    const handleCancel = () => {
        if (onClose) onClose()
        else navigate('/sales')
    }

    useEffect(() => {
        if (!id) return;

        console.log("Loading sale:", id);

        salesService
            .getById(id)
            .then(r => {
                console.log("Response:", r.data);
                setSale(r.data);
            })
            .catch(err => {
                console.error("Failed to load sale", err);
            });

    }, [id]);

    if (!sale) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

    return (
        <Box sx={{ maxWidth: 720 }}>
            {!onClose && <PageHeader title={`Sale #${sale.id}`} subtitle={sale.salesDate ? new Date(sale.salesDate).toLocaleDateString() : ''}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button startIcon={<ArrowBack />} onClick={handleCancel}>Back</Button>
                        {sale.invoiceId && <Button variant="contained" startIcon={<Receipt />} onClick={() => navigate(`/invoices/${sale.invoiceId}`)}>Invoice</Button>}
                    </Stack>
                } />}
            <Stack spacing={2.5}>
                <Grid container spacing={2}>
                    {[['Customer', sale.customerName || 'Walk-in'], ['Payment', sale.paymentMethod], ['Date', sale.salesDate ? new Date(sale.salesDate).toLocaleDateString() : '—'], ['Total', `LKR ${Number(sale.totalAmount || 0).toLocaleString()}`]].map(([l, v]) => (
                        <Grid size={{ xs: 6, sm: 3 }} key={l}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>{l}</Typography>
                                <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>{v}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <SectionCard title="Items">
                    {(sale.items || []).map((item, i) => (
                        <Box key={i}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
                                <Box><Typography variant="body2" fontWeight={600}>{item.productName}</Typography><Typography variant="caption" color="text.disabled">Qty: {item.quantity} × LKR {Number(item.price).toLocaleString()}</Typography></Box>
                                <Typography variant="body2" fontWeight={700}>LKR {Number(item.subtotal).toLocaleString()}</Typography>
                            </Stack>
                            {i < (sale.items || []).length - 1 && <Divider />}
                        </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        <Typography fontWeight={700}>Total</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main">LKR {Number(sale.totalAmount || 0).toLocaleString()}</Typography>
                    </Stack>
                </SectionCard>
            </Stack>
        </Box>
    )
}