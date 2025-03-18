import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Paper
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CloseIcon from '@mui/icons-material/Close';
import BuyerProfilePanel from './advanced-analysis/BuyerProfilePanel';
import InvestmentOptionsPanel from './advanced-analysis/InvestmentOptionsPanel';
import FinancialAnalysisPanel from './advanced-analysis/FinancialAnalysisPanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface AdvancedAnalysisButtonProps {
  propertyDetails: any;
  estimatedPrice: number;
  formatPrice: (price: number) => string;
}

const AdvancedAnalysisButton: React.FC<AdvancedAnalysisButtonProps> = ({
  propertyDetails,
  estimatedPrice,
  formatPrice
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
    if (!analysisData && !loading) {
      fetchAnalysisData();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/advanced-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyDetails,
          estimatedPrice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gelişmiş analiz verileri alınamadı');
      }

      const data = await response.json();
      console.log('Analiz verileri:', data);
      setAnalysisData(data);
    } catch (err) {
      console.error('Gelişmiş analiz hatası:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AnalyticsIcon />}
        fullWidth
        onClick={handleOpen}
        sx={{
          fontWeight: 'bold',
          py: 1.5,
          background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
          boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
        }}
      >
        Gelişmiş Yapay Zeka Analizi
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Gelişmiş Yapay Zeka Analizi</Typography>
          </Box>
          <Button
            size="small"
            onClick={handleClose}
            color="inherit"
            sx={{ minWidth: 'auto', p: 0.5 }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={60} thickness={4} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Yapay zeka detaylı analiz yapıyor, lütfen bekleyin...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && analysisData && (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="advanced analysis tabs"
                  variant="fullWidth"
                >
                  <Tab label="Alıcı Profili" />
                  <Tab label="Yatırım Önerileri" />
                  <Tab label="Finansal Analiz" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <BuyerProfilePanel buyerProfile={analysisData.buyerProfile} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <InvestmentOptionsPanel 
                  investmentOptions={analysisData.investmentOptions} 
                  formatPrice={formatPrice} 
                />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <FinancialAnalysisPanel financialAnalysis={analysisData.financialAnalysis} formatPrice={formatPrice} />
              </TabPanel>
            </>
          )}

          {!loading && !error && !analysisData && (
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Yapay zeka analizi henüz gerçekleştirilmedi.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={fetchAnalysisData}
                startIcon={<AnalyticsIcon />}
              >
                Analizi Başlat
              </Button>
            </Paper>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdvancedAnalysisButton; 