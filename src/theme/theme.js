import { createTheme, alpha } from '@mui/material/styles';

// ── Palette ──────────────────────────────────────────────────
const PRIMARY = '#1B4FD8';   // bold indigo
const SECONDARY = '#0EA5E9';   // sky blue
const SUCCESS = '#10B981';
const WARNING = '#F59E0B';
const ERROR = '#EF4444';
const BG_MAIN = '#F1F5FB';
const BG_PAPER = '#FFFFFF';
const SIDEBAR = '#0F172A';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: PRIMARY, light: '#4B73E0', dark: '#1340B0', contrastText: '#fff' },
        secondary: { main: SECONDARY, light: '#38BDF8', dark: '#0284C7', contrastText: '#fff' },
        success: { main: SUCCESS, light: '#34D399', dark: '#059669' },
        warning: { main: WARNING, light: '#FBD24D', dark: '#D97706' },
        error: { main: ERROR, light: '#F87171', dark: '#DC2626' },
        background: { default: BG_MAIN, paper: BG_PAPER },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
            disabled: '#94A3B8',
        },
        divider: '#E2E8F0',
        sidebar: {
            bg: SIDEBAR,
            hover: '#1E293B',
            active: PRIMARY,
            text: '#94A3B8',
            textActive: '#FFFFFF',
        },
    },

    // ── Typography ───────────────────────────────────────────────
    typography: {
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        h1: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
        h2: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
        h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
        h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
        h5: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
        h6: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600, color: '#475569' },
        button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0.2 },
    },

    shape: { borderRadius: 12 },

    shadows: [
        'none',
        '0 1px 3px rgba(15,23,42,0.07)',
        '0 2px 8px rgba(15,23,42,0.09)',
        '0 4px 16px rgba(15,23,42,0.10)',
        '0 8px 24px rgba(15,23,42,0.12)',
        '0 12px 40px rgba(15,23,42,0.14)',
        ...Array(19).fill('none'),
    ],

    // ── Component Overrides ──────────────────────────────────────
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': { boxSizing: 'border-box' },
                body: { background: BG_MAIN },
                '::-webkit-scrollbar': { width: 6, height: 6 },
                '::-webkit-scrollbar-track': { background: 'transparent' },
                '::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: 99 },
                '::-webkit-scrollbar-thumb:hover': { background: '#94A3B8' },
                '@keyframes fadeUp': {
                    from: { opacity: 0, transform: 'translateY(14px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
                '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
            },
        },

        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: ({ ownerState }) => ({
                    borderRadius: 9,
                    fontWeight: 600,
                    padding: ownerState.size === 'small' ? '5px 14px' : ownerState.size === 'large' ? '11px 28px' : '8px 20px',
                    fontSize: ownerState.size === 'small' ? 13 : 14,
                    transition: 'all 0.18s ease',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(27,79,216,0.25)' },
                    '&:active': { transform: 'translateY(0)' },
                }),
                containedPrimary: {
                    background: `linear-gradient(135deg, ${PRIMARY} 0%, #4B73E0 100%)`,
                    boxShadow: `0 2px 8px ${alpha(PRIMARY, 0.35)}`,
                },
            },
        },

        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    border: '1px solid #E2E8F0',
                    borderRadius: 14,
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': { boxShadow: '0 4px 20px rgba(15,23,42,0.09)' },
                },
            },
        },

        MuiCardContent: {
            styleOverrides: { root: { padding: 24, '&:last-child': { paddingBottom: 24 } } },
        },

        MuiTextField: {
            defaultProps: { variant: 'outlined', size: 'small' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 9,
                        background: '#fff',
                        fontSize: 14,
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#94A3B8' },
                        '&.Mui-focused fieldset': { borderColor: PRIMARY, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root': { fontSize: 14, fontWeight: 600, color: '#475569' },
                },
            },
        },

        MuiSelect: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                outlined: { borderRadius: 9, background: '#fff', fontSize: 14 },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, fontSize: 12, borderRadius: 7 },
                colorSuccess: { background: '#D1FAE5', color: '#065F46' },
                colorWarning: { background: '#FEF3C7', color: '#92400E' },
                colorError: { background: '#FEE2E2', color: '#991B1B' },
                colorInfo: { background: '#DBEAFE', color: '#1E40AF' },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        background: '#F8FAFC',
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#64748B',
                        borderBottom: '2px solid #E2E8F0',
                    },
                },
            },
        },

        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root': {
                        transition: 'background 0.15s',
                        '&:hover': { background: '#F8FAFC' },
                    },
                    '& .MuiTableCell-body': { fontSize: 14, borderColor: '#F1F5F9' },
                },
            },
        },

        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: { borderRadius: 14, border: '1px solid #E2E8F0' },
            },
        },

        MuiDivider: {
            styleOverrides: { root: { borderColor: '#E2E8F0' } },
        },

        MuiAlert: {
            styleOverrides: { root: { borderRadius: 10, fontWeight: 500 } },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: { borderRadius: 8, fontSize: 12, fontWeight: 500, background: '#0F172A' },
            },
        },

        MuiLinearProgress: {
            styleOverrides: { root: { borderRadius: 99, height: 6 } },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 9,
                    margin: '1px 8px',
                    padding: '9px 12px',
                    transition: 'all 0.18s ease',
                },
            },
        },
    },
});

export default theme;
