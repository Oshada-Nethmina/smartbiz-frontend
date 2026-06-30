import React, { useEffect, useState } from 'react'
import {
  Box, Grid, Typography, Stack, Chip, Paper, LinearProgress,
  Table, TableBody, TableCell, TableHead, TableRow, alpha,
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { adminService } from '@/services'
import { PageHeader, SectionCard } from '@/components/common/UI'

const PURPLE = '#7C3AED'

const MOCK_MONTHLY = [
  { month: 'Jan', logins: 312, apiCalls: 1840, newUsers: 23 },
  { month: 'Feb', logins: 398, apiCalls: 2130, newUsers: 31 },
  { month: 'Mar', logins: 445, apiCalls: 2670, newUsers: 28 },
  { month: 'Apr', logins: 502, apiCalls: 3100, newUsers: 42 },
  { month: 'May', logins: 578, apiCalls: 3540, newUsers: 55 },
  { month: 'Jun', logins: 634, apiCalls: 3980, newUsers: 61 },
]

const MOCK_LOGS = [
  { business: 'Kamal Store',    action: 'AI Insight', user: 'kamal@store.lk',   time: '2 min ago',   status: 'success' },
  { business: 'Nimal Traders',  action: 'Login',      user: 'nimal@traders.lk', time: '5 min ago',   status: 'success' },
  { business: 'Sunil Bakery',   action: 'AI Email',   user: 'sunil@bakery.lk',  time: '12 min ago',  status: 'success' },
  { business: 'Chami Fashion',  action: 'Login',      user: 'chami@fashion.lk', time: '18 min ago',  status: 'failed'  },
  { business: 'Ravi Electrics', action: 'Report',     user: 'ravi@elec.lk',     time: '24 min ago',  status: 'success' },
  { business: 'Dilini Crafts',  action: 'AI Marketing', user: 'dilini@crafts.lk', time: '31 min ago', status: 'success' },
  { business: 'Priya Sweets',   action: 'Login',      user: 'priya@sweets.lk',  time: '45 min ago',  status: 'success' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary">{label}</Typography>
      {payload.map(p => (
        <Stack key={p.name} direction="row" justifyContent="space-between" spacing={3}>
          <Typography variant="caption" color="text.secondary">{p.name}</Typography>
          <Typography variant="caption" fontWeight={700} color={p.color}>{p.value}</Typography>
        </Stack>
      ))}
    </Paper>
  )
}

export default function AdminReports() {
  const [logs, setLogs] = useState(MOCK_LOGS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminService.getUsageLogs()
      .then(r => { if (r.data?.length) setLogs(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ animation: 'fadeUp 0.35s ease both' }}>
      <PageHeader title="Usage Reports" subtitle="Platform-wide activity and performance metrics" />

      {/* ── Summary Cards ──────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total Logins (Month)',  value: '634',   pct: 78, color: '#2563EB' },
          { label: 'API Calls (Month)',     value: '3,980', pct: 65, color: PURPLE    },
          { label: 'New Signups (Month)',   value: '61',    pct: 45, color: '#10B981' },
          { label: 'Error Rate',           value: '2.1%',  pct: 5,  color: '#EF4444' },
        ].map(s => (
          <Grid size={{ xs:12, sm:6, xl:3 }} key={s.label}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', background: '#fff' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
              <LinearProgress
                variant="determinate" value={s.pct}
                sx={{ mt: 1.5, height: 5, borderRadius: 3, bgcolor: alpha(s.color, 0.1), '& .MuiLinearProgress-bar': { bgcolor: s.color, borderRadius: 3 } }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Charts ──────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs:12, lg:8 }}>
          <SectionCard title="Monthly Platform Activity" action={<Chip label="Last 6 months" size="small" variant="outlined" sx={{ fontWeight: 600 }} />}>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={MOCK_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="logins" name="Logins" stroke="#2563EB" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#10B981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>

        <Grid size={{ xs:12, lg:4 }}>
          <SectionCard title="API Calls per Month">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={MOCK_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}`, 'API Calls']} />
                <Bar dataKey="apiCalls" name="API Calls" fill={PURPLE} radius={[5, 5, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>
      </Grid>

      {/* ── Activity Log ──────────────────────────── */}
      <SectionCard title="Recent Activity Log">
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Business', 'Action', 'User', 'Time', 'Status'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{log.business}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{log.action}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{log.user}</TableCell>
                <TableCell sx={{ color: 'text.disabled', fontSize: 12 }}>{log.time}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    size="small"
                    color={log.status === 'success' ? 'success' : 'error'}
                    sx={{ fontWeight: 700, fontSize: 11, height: 20 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </Box>
  )
}
