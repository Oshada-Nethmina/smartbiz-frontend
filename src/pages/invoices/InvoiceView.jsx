import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Box, Grid, Typography, Button, Stack, Divider,
    CircularProgress, Paper, Table, TableHead, TableBody,
    TableRow, TableCell, Alert,
} from '@mui/material'
import { Print, AutoAwesome, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { invoiceService, aiService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader } from '@/components/common/UI'
import toast from 'react-hot-toast'

export default function InvoiceView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { business } = useBusiness()
    const [invoice, setInvoice] = useState(null)
    const [aiSummary, setAiSummary] = useState('')
    const [aiLoading, setAiLoading] = useState(false)

    useEffect(() => {
        invoiceService.getById(id).then(r => setInvoice(r.data)).catch(() => navigate('/invoices'))
    }, [id])

    const handleAISummary = async () => {
        setAiLoading(true)
        try {
            const res = await aiService.summarizeInvoice(id)
            setAiSummary(res.data.result)
        } catch { toast.error('AI summary failed') } finally { setAiLoading(false) }
    }

    if (!invoice) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

    return (
        <Box sx={{ maxWidth: 760 }}>
            <PageHeader
                title={`Invoice #${invoice.id}`}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button startIcon={<ArrowBack />} onClick={() => navigate('/invoices')}>Back</Button>
                        <Button variant="outlined" startIcon={aiLoading ? <CircularProgress size={16} /> : <AutoAwesome />} onClick={handleAISummary} disabled={aiLoading}>
                            AI Summary
                        </Button>
                        <Button variant="contained" startIcon={<Print />} onClick={() => window.print()}>
                            Print / PDF
                        </Button>
                    </Stack>
                }
            />

            {aiSummary && (
                <Alert severity="info" icon={<AutoAwesome />} sx={{ mb: 2.5, '& .MuiAlert-message': { width: '100%' } }}>
                    <Typography variant="subtitle2" fontWeight={700} mb={0.5}>AI Summary</Typography>
                    <Typography variant="body2">{aiSummary}</Typography>
                </Alert>
            )}

            <Paper sx={{ p: 4, '@media print': { boxShadow: 'none', border: 'none' } }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
                    <Box>
                        <Typography variant="h3" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                            INVOICE
                        </Typography>
                        <Typography variant="body2" color="text.disabled" mt={0.5}>#{invoice.id}</Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="h6" fontWeight={700}>{business?.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{business?.address}</Typography>
                        <Typography variant="body2" color="text.secondary">{business?.phone}</Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Bill to / Invoice details */}
                <Grid container spacing={3} mb={4}>
                    <Grid size={{ xs:6 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.disabled', display: 'block', mb: 0.5 }}>
                            Bill To
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>{invoice.customerName || 'Walk-in Customer'}</Typography>
                        {invoice.customerEmail && <Typography variant="body2" color="text.secondary">{invoice.customerEmail}</Typography>}
                    </Grid>
                    <Grid size={{ xs:6 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.disabled', display: 'block', mb: 0.5 }}>
                            Invoice Details
                        </Typography>
                        <Typography variant="body2">Date: <strong>{new Date(invoice.createdAt).toLocaleDateString()}</strong></Typography>
                        <Typography variant="body2">Payment: <strong>{invoice.paymentMethod}</strong></Typography>
                    </Grid>
                </Grid>

                {/* Items Table */}
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: '#F8FAFC' }}>
                            {['Item Description', 'Qty', 'Unit Price', 'Subtotal'].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.disabled' }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(invoice.items || []).map((item, i) => (
                            <TableRow key={i}>
                                <TableCell><Typography variant="body2" fontWeight={500}>{item.productName}</Typography></TableCell>
                                <TableCell><Typography variant="body2">{item.quantity}</Typography></TableCell>
                                <TableCell><Typography variant="body2">LKR {Number(item.price).toLocaleString()}</Typography></TableCell>
                                <TableCell><Typography variant="body2" fontWeight={700}>LKR {Number(item.subtotal).toLocaleString()}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
                    <Typography variant="h6" fontWeight={800}>TOTAL</Typography>
                    <Typography variant="h4" fontWeight={900} color="primary.main" sx={{ fontFamily: '"Fraunces", serif' }}>
                        LKR {Number(invoice.totalAmount || 0).toLocaleString()}
                    </Typography>
                </Stack>

                <Divider sx={{ mt: 3, mb: 2 }} />
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center' }}>
                    Thank you for your business! — {business?.name}
                </Typography>
            </Paper>
        </Box>
    )
}
