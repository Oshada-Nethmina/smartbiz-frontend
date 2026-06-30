import React, { useState } from 'react'
import {
  Box, Grid, Typography, Paper, Stack, Button, TextField,
  Tab, Tabs, CircularProgress, Divider, Chip, alpha,
} from '@mui/material'
import {
  AutoAwesome, BarChart, Email, Campaign, Receipt, Send, ContentCopy,
} from '@mui/icons-material'
import { aiService } from '@/services'
import { useBusiness } from '@/context/BusinessContext'
import { PageHeader, SectionCard } from '@/components/common/UI'
import toast from 'react-hot-toast'

const BLUE = '#1B4FD8'

const FEATURE_TABS = [
  { id: 0, label: 'Business Insights',  icon: <BarChart />,    color: '#2563EB', placeholder: 'e.g., How did I perform last month? What was my best-selling product?' },
  { id: 1, label: 'Email Generator',    icon: <Email />,       color: '#7C3AED', placeholder: 'e.g., Write a follow-up email for customers who haven\'t purchased in 30 days.' },
  { id: 2, label: 'Marketing Post',     icon: <Campaign />,    color: '#D97706', placeholder: 'e.g., Write a Facebook post announcing our new summer collection arrival!' },
  { id: 3, label: 'Invoice Summary',    icon: <Receipt />,     color: '#10B981', placeholder: 'Enter Invoice ID to summarize...' },
]

const QUICK_PROMPTS = {
  0: ['How did I perform last month?', 'What is my most profitable product?', 'Compare this month vs last month', 'Which customers buy the most?'],
  1: ['Thank a loyal customer', 'Follow up on unpaid invoice', 'Handle a complaint professionally', 'Announce a new product launch'],
  2: ['Facebook post for new arrivals', 'Instagram caption for a sale', 'WhatsApp status for discount offer', 'Promotional post for festive season'],
  3: [],
}

export default function AIAssistant() {
  const { business } = useBusiness()
  const [tab, setTab] = useState(0)
  const [prompt, setPrompt] = useState('')
  const [invoiceId, setInvoiceId] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const currentFeature = FEATURE_TABS[tab]

  const handleGenerate = async () => {
    if (!business?.id) { toast.error('No business found'); return }
    const text = tab === 3 ? invoiceId : prompt
    if (!text.trim()) { toast.error('Please enter a prompt'); return }

    setLoading(true)
    setResponse('')
    try {
      let res
      if (tab === 0)      res = await aiService.businessInsight(business.id, prompt)
      else if (tab === 1) res = await aiService.generateEmail(business.id, prompt)
      else if (tab === 2) res = await aiService.generateMarketing(business.id, prompt)
      else if (tab === 3) res = await aiService.summarizeInvoice(Number(invoiceId))
      setResponse(res.data?.content || res.data?.response || res.data?.text || JSON.stringify(res.data))
    } catch (err) {
      const msg = err.response?.data?.message || 'AI request failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    toast.success('Copied to clipboard!')
  }

  return (
    <Box sx={{ animation: 'fadeUp 0.35s ease both' }}>
      <PageHeader
        title="AI Assistant"
        subtitle="Powered by OpenAI — insights, emails, and marketing posts for your business"
        icon={<AutoAwesome sx={{ color: BLUE }} />}
      />

      <Grid container spacing={2.5}>
        {/* ── Left: Input Panel ─────────────────── */}
        <Grid size={{ xs:12, lg:5 }}>
          <SectionCard title="What would you like?" sx={{ height: '100%' }}>
            {/* Feature Tabs */}
            <Tabs
              value={tab}
              onChange={(_, v) => { setTab(v); setPrompt(''); setResponse('') }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2.5, minHeight: 38,
                '& .MuiTab-root': { minHeight: 38, fontSize: 12, fontWeight: 600, textTransform: 'none', py: 1 },
                '& .MuiTabs-indicator': { bgcolor: currentFeature.color },
              }}
            >
              {FEATURE_TABS.map(f => (
                <Tab
                  key={f.id}
                  icon={React.cloneElement(f.icon, { sx: { fontSize: 16 } })}
                  iconPosition="start"
                  label={f.label}
                  sx={{ color: tab === f.id ? f.color : 'text.secondary', '&.Mui-selected': { color: f.color } }}
                />
              ))}
            </Tabs>

            {/* Prompt Input */}
            {tab === 3 ? (
              <TextField
                fullWidth
                label="Invoice ID"
                type="number"
                value={invoiceId}
                onChange={e => setInvoiceId(e.target.value)}
                placeholder="Enter the Invoice ID to summarize"
                sx={{ mb: 2 }}
              />
            ) : (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your request"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={currentFeature.placeholder}
                sx={{ mb: 2 }}
              />
            )}

            {/* Quick Prompts */}
            {QUICK_PROMPTS[tab]?.length > 0 && (
              <Box mb={2.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} mb={1} display="block">
                  💡 Quick suggestions
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.8}>
                  {QUICK_PROMPTS[tab].map(q => (
                    <Chip
                      key={q}
                      label={q}
                      size="small"
                      clickable
                      onClick={() => setPrompt(q)}
                      sx={{
                        fontSize: 11, fontWeight: 500,
                        bgcolor: alpha(currentFeature.color, 0.08),
                        color: currentFeature.color,
                        border: `1px solid ${alpha(currentFeature.color, 0.2)}`,
                        '&:hover': { bgcolor: alpha(currentFeature.color, 0.14) },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send fontSize="small" />}
              disabled={loading}
              onClick={handleGenerate}
              sx={{
                bgcolor: currentFeature.color,
                '&:hover': { bgcolor: currentFeature.color, filter: 'brightness(0.9)' },
                fontWeight: 700, py: 1.4,
              }}
            >
              {loading ? 'Generating…' : 'Generate with AI'}
            </Button>
          </SectionCard>
        </Grid>

        {/* ── Right: Response Panel ─────────────── */}
        <Grid size={{ xs:12, lg:7 }}>
          <Paper
            elevation={0}
            sx={{
              height: '100%', minHeight: 400, p: 3, borderRadius: 3,
              border: '1px solid', borderColor: 'divider',
              background: response ? '#fff' : alpha(currentFeature.color, 0.02),
              display: 'flex', flexDirection: 'column',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoAwesome sx={{ fontSize: 18, color: currentFeature.color }} />
                <Typography fontWeight={700} fontSize={14}>AI Response</Typography>
                {response && (
                  <Chip
                    label={currentFeature.label}
                    size="small"
                    sx={{ fontSize: 11, bgcolor: alpha(currentFeature.color, 0.1), color: currentFeature.color, fontWeight: 600 }}
                  />
                )}
              </Stack>
              {response && (
                <Button
                  startIcon={<ContentCopy fontSize="small" />}
                  size="small"
                  onClick={handleCopy}
                  sx={{ color: currentFeature.color }}
                >
                  Copy
                </Button>
              )}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Stack flex={1} alignItems="center" justifyContent="center" spacing={2}>
                <CircularProgress size={36} sx={{ color: currentFeature.color }} />
                <Typography variant="body2" color="text.secondary">AI is thinking…</Typography>
              </Stack>
            ) : response ? (
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.8, color: '#1E293B', whiteSpace: 'pre-wrap', flex: 1 }}
              >
                {response}
              </Typography>
            ) : (
              <Stack flex={1} alignItems="center" justifyContent="center" spacing={1.5} sx={{ opacity: 0.5 }}>
                {React.cloneElement(currentFeature.icon, { sx: { fontSize: 48, color: currentFeature.color } })}
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Your AI-generated {currentFeature.label.toLowerCase()} will appear here
                </Typography>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ── Feature Cards ──────────────────────────── */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {FEATURE_TABS.map(f => (
          <Grid size={{ xs:12, sm:6, md:3 }} key={f.id}>
            <Paper
              elevation={0}
              onClick={() => { setTab(f.id); setPrompt(''); setResponse('') }}
              sx={{
                p: 2, borderRadius: 2.5, border: '1px solid', cursor: 'pointer',
                borderColor: tab === f.id ? f.color : 'divider',
                bgcolor: tab === f.id ? alpha(f.color, 0.04) : '#fff',
                transition: 'all 0.18s',
                '&:hover': { borderColor: f.color, bgcolor: alpha(f.color, 0.04), transform: 'translateY(-2px)', boxShadow: `0 6px 16px ${alpha(f.color, 0.12)}` },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ color: f.color }}>{React.cloneElement(f.icon, { sx: { fontSize: 22, color: f.color } })}</Box>
                <Box>
                  <Typography fontWeight={700} fontSize={13}>{f.label}</Typography>
                  <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                    {f.id === 0 && 'Natural language reports'}
                    {f.id === 1 && 'Professional email drafts'}
                    {f.id === 2 && 'Social media content'}
                    {f.id === 3 && 'Invoice analysis'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
