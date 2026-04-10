import React, { useState } from 'react'
import {
  Box, Typography, Button, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, Stack, alpha,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ─────────────────────────────────────────
// PageHeader
// ─────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        mb: 3,
        animation: 'fadeUp 0.3s ease both',
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  )
}

// ─────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────
export function StatCard({ title, value, change, icon, color = 'primary.main', sx = {} }) {
  const theme = useTheme()
  const isPositive = change >= 0

  return (
    <Paper
      sx={{
        p: 3, height: '100%',
        background: '#fff',
        animation: 'fadeUp 0.35s ease both',
        ...sx,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800, fontFamily: '"Fraunces", serif', color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48, height: 48, borderRadius: 2.5,
            background: alpha(theme.palette[color.split('.')[0]]?.main || theme.palette.primary.main, 0.12),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {icon}
        </Box>
      </Stack>

      {change !== undefined && (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: isPositive ? 'success.main' : 'error.main' }}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>vs last month</Typography>
        </Stack>
      )}
    </Paper>
  )
}

// ─────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────
export function DataTable({ columns, data = [], loading = false, emptyMessage = 'No data found.', rowsPerPageOptions = [10, 25, 50] }) {
  const [page, setPage]               = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} />
      </Box>
    )
  }

  const paginated = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 8, color: 'text.disabled' }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length > rowsPerPageOptions[0] && (
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0) }}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 0 }}
        />
      )}
    </Box>
  )
}

// ─────────────────────────────────────────
// StatusChip
// ─────────────────────────────────────────
export function StatusChip({ label, type = 'info', size = 'small' }) {
  const colorMap = { success: 'success', danger: 'error', warning: 'warning', info: 'info', default: 'default' }
  return <Chip label={label} color={colorMap[type] || 'default'} size={size} />
}

// ─────────────────────────────────────────
// ConfirmDialog
// ─────────────────────────────────────────
export function ConfirmDialog({ open, title = 'Confirm', message, onConfirm, onCancel, loading = false }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ─────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
      <Typography fontSize={48} mb={1}>{icon}</Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: 'auto', mb: 3 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  )
}

// ─────────────────────────────────────────
// SectionCard  (paper wrapper with title)
// ─────────────────────────────────────────
export function SectionCard({ title, action, children, sx = {} }) {
  return (
    <Paper sx={{ p: 3, ...sx }}>
      {(title || action) && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
          {title && (
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700 }}>
              {title}
            </Typography>
          )}
          {action}
        </Stack>
      )}
      {children}
    </Paper>
  )
}
