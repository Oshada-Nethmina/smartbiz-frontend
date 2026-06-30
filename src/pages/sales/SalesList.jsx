import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, IconButton, Tooltip, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Add, Visibility } from '@mui/icons-material'
import { salesService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, DataTable, SectionCard } from '@/components/common/UI'
import SalesForm from './SalesForm'
import SalesDetail from './SalesDetail'

export default function SalesList() {
  const { business } = useBusiness(); const navigate = useNavigate()
  const [sales, setSales] = useState([]); const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewId, setViewId] = useState(null)

  useEffect(() => {
    console.log("Business:", business);

    if (business?.id) {
      fetchSales()
    } else {
      console.log("Business not loaded");
      setLoading(false);
    }
  }, [business]);

  const fetchSales = () => {
    setLoading(true)
    salesService.getAll(business.id)
      .then(r => {
        console.log(r.data);
        setSales(r.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }

  const columns = [
    { key: 'salesDate', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'customerName', label: 'Customer' },
    { key: 'totalAmount', label: 'Total', render: (v) => `LKR ${Number(v || 0).toLocaleString()}` },
    { key: 'paymentMethod', label: 'Payment', render: (v) => <Chip label={v || 'Cash'} size="small" color="info" /> },
    {
      key: 'actions', label: '', render: (_, row) => (
        <Tooltip title="View"><IconButton size="small" onClick={() => {
          console.log("Clicked row:", row);
          console.log("Setting viewId:", row.id);
          setViewId(row.id);
        }}><Visibility fontSize="small" /></IconButton></Tooltip>
      )
    },
  ]
  console.log("viewId =", viewId);
  return (
    <Box>
      <PageHeader title="Sales" subtitle={`${sales.length} total sales`}
        action={<Button variant="contained" startIcon={<Add />} onClick={() => setIsFormOpen(true)}>New Sale</Button>} />
      <SectionCard><DataTable columns={columns} data={sales} loading={loading} /></SectionCard>

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>New Sale</DialogTitle>
        <DialogContent dividers>
          <SalesForm
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false)
              fetchSales()
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewId} onClose={() => setViewId(null)} maxWidth="md" fullWidth >
        <DialogContent dividers sx={{ p: 0, '& .MuiBox-root': { maxWidth: '100%' } }}>
          {console.log("Dialog viewId =", viewId)}
          <SalesDetail saleId={viewId} onClose={() => setViewId(null)} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}