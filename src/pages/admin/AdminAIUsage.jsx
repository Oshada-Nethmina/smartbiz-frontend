import React, { useEffect, useState } from 'react'
import {
  Box, Chip, Stack, Typography, Paper, Grid, LinearProgress, alpha,
} from '@mui/material'
import { AutoAwesome, TrendingUp } from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { adminService } from '@/services'
import { PageHeader, SectionCard } from '@/components/common/UI'

const PURPLE = '#7C3AED'

const FEATURES = [
  { key: 'businessInsight', label: 'Business Insights', desc: '"How did I perform last month?"', icon: '📊', color: '#7C3AED' },
  { key: 'emailGenerator',  label: 'Email Generator',   desc: 'Customer follow-ups & complaints', icon: '✉️',  color: '#2563EB' },
  { key: 'marketing',       label: 'Marketing Posts',    desc: 'Facebook/social media content',   icon: '📣',  color: '#D97706' },
  { key: 'invoiceSummary',  label: 'Invoice Summary',    desc: 'AI-powered invoice analysis',     icon: '🧾',  color: '#10B981' },
]

const MOCK_DAILY = [
  { day: 'Mon', requests: 34 },
  { day: 'Tue', requests: 52 },
  { day: 'Wed', requests: 41 },
  { day: 'Thu', requests: 68 },
  { day: 'Fri', requests: 79 },
  { day: 'Sat', requests: 25 },
  { day: 'Sun', requests: 18 },
]

const MOCK_FEATURE_USAGE = [
  { key: 'businessInsight', count: 145, total: 336 },
  { key: 'emailGenerator',  count: 87,  total: 336 },
  { key: 'marketing',       count: 63,  total: 336 },
  { key: 'invoiceSummary',  count: 41,  total: 336 },
]

export default function AdminAIUsage() {
  const [aiData, setAiData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getAIUsage()
      .then(r => setAiData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ animation: 'fadeUp 0.35s ease both' }}>
      <PageHeader
        title="AI Usage Monitor"
        subtitle="Track OpenAI feature usage across all businesses"
        icon={<AutoAwesome sx={{ color: PURPLE }} />}
      />

      {/* ── Feature Cards ─────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {MOCK_FEATURE_USAGE.map((f, i) => {
          const meta = FEATURES[i]
          const pct = Math.round((f.count / f.total) * 100)
          return (
            <Grid size={{ xs:12, sm:6, xl:3 }} key={f.key}>
              <Paper elevation={0} sx={{
                p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', background: '#fff',
                '&:hover': { boxShadow: `0 8px 24px ${alpha(meta.color, 0.12)}` },
                transition: 'box-shadow 0.2s',
              }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                  <Typography fontSize={24}>{meta.icon}</Typography>
                  <Box>
                    <Typography fontWeight={700} fontSize={13}>{meta.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{meta.desc}</Typography>
                  </Box>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ color: meta.color }}>{f.count}</Typography>
                <Typography variant="caption" color="text.secondary">requests total</Typography>
                <LinearProgress
                  variant="determinate" value={pct}
                  sx={{ mt: 1.5, height: 6, borderRadius: 3, bgcolor: alpha(meta.color, 0.1), '& .MuiLinearProgress-bar': { bgcolor: meta.color, borderRadius: 3 } }}
                />
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{pct}% of all AI usage</Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* ── Daily Chart ─────────────────────────────────── */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs:12, lg:8 }}>
          <SectionCard
            title="Daily AI Requests (This Week)"
            action={<Chip label={`${MOCK_DAILY.reduce((a, d) => a + d.requests, 0)} total`} size="small" sx={{ bgcolor: alpha(PURPLE, 0.1), color: PURPLE, fontWeight: 700 }} />}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MOCK_DAILY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} requests`, 'AI Requests']} />
                <Bar dataKey="requests" name="AI Requests" fill={PURPLE} radius={[5, 5, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </Grid>

        <Grid size={{ xs:12, lg:4 }}>
          <SectionCard title="Top Businesses by AI Usage">
            {[
              { name: 'Kamal Store', requests: 87, plan: 'Pro' },
              { name: 'Nimal Traders', requests: 64, plan: 'Starter' },
              { name: 'Sunil Bakery', requests: 43, plan: 'Pro' },
              { name: 'Chami Fashion', requests: 31, plan: 'Free' },
              { name: 'Ravi Electrics', requests: 18, plan: 'Starter' },
            ].map((b, i) => (
              <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" py={1.2} sx={{ borderBottom: i < 4 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight={700} fontSize={13} sx={{ color: PURPLE, width: 20, textAlign: 'right' }}>#{i + 1}</Typography>
                  <Box>
                    <Typography fontSize={13} fontWeight={600}>{b.name}</Typography>
                    <Chip label={b.plan} size="small" sx={{ height: 16, fontSize: 10, fontWeight: 700 }} />
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUp sx={{ fontSize: 14, color: '#10B981' }} />
                  <Typography fontWeight={700} fontSize={13}>{b.requests}</Typography>
                </Stack>
              </Stack>
            ))}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}
