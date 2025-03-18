import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaidIcon from '@mui/icons-material/Paid';
import PaymentsIcon from '@mui/icons-material/Payments';
import PercentIcon from '@mui/icons-material/Percent';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface FinancialAnalysisProps {
  financialAnalysis: {
    mortgageAnalysis: {
      loanScenarios: Array<{
        downPaymentPercentage: number;
        downPaymentAmount: number;
        loanAmount: number;
        term: number;
        monthlyPayment: number;
        totalPayment: number;
        totalInterest: number;
      }>;
    };
    investmentAnalysis: {
      rentalEstimate: {
        monthlyRental: number;
        annualRental: number;
        rentalYield: number;
      };
      appreciationEstimate: {
        annualAppreciationRate: number;
        valueAfter5Years: number;
        valueAfter10Years: number;
      };
      breakEvenAnalysis: {
        breakEvenPoint: number;
        cashFlowPositiveAfter: number;
      };
    };
    financialAdvice: string[];
  };
  formatPrice: (price: number) => string;
}

const FinancialAnalysisPanel: React.FC<FinancialAnalysisProps> = ({ 
  financialAnalysis, 
  formatPrice 
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  if (!financialAnalysis) {
    return <Typography>Finansal analiz bilgisi bulunamadı</Typography>;
  }

  const { mortgageAnalysis, investmentAnalysis, financialAdvice } = financialAnalysis;
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Kredi senaryolarını karşılaştıran grafik verileri
  const loanComparisonData = {
    labels: mortgageAnalysis.loanScenarios.map(s => `%${s.downPaymentPercentage} Peşinat`),
    datasets: [
      {
        label: 'Aylık Ödeme',
        data: mortgageAnalysis.loanScenarios.map(s => s.monthlyPayment),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
      },
      {
        label: 'Toplam Faiz',
        data: mortgageAnalysis.loanScenarios.map(s => s.totalInterest / 1000), // Binler cinsinden
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
      }
    ]
  };
  
  // Değer artış grafiği verileri
  const appreciationData = {
    labels: ['Şimdi', '1 Yıl', '2 Yıl', '3 Yıl', '4 Yıl', '5 Yıl', '10 Yıl'],
    datasets: [
      {
        label: 'Tahmini Değer (TL)',
        data: [
          investmentAnalysis.appreciationEstimate.valueAfter5Years / Math.pow(1 + investmentAnalysis.appreciationEstimate.annualAppreciationRate / 100, 5),
          investmentAnalysis.appreciationEstimate.valueAfter5Years / Math.pow(1 + investmentAnalysis.appreciationEstimate.annualAppreciationRate / 100, 4),
          investmentAnalysis.appreciationEstimate.valueAfter5Years / Math.pow(1 + investmentAnalysis.appreciationEstimate.annualAppreciationRate / 100, 3),
          investmentAnalysis.appreciationEstimate.valueAfter5Years / Math.pow(1 + investmentAnalysis.appreciationEstimate.annualAppreciationRate / 100, 2),
          investmentAnalysis.appreciationEstimate.valueAfter5Years / (1 + investmentAnalysis.appreciationEstimate.annualAppreciationRate / 100),
          investmentAnalysis.appreciationEstimate.valueAfter5Years,
          investmentAnalysis.appreciationEstimate.valueAfter10Years
        ],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        tension: 0.3
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Finansal Analiz
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Yapay zeka, mülkün finansal potansiyelini ve yatırım analizini değerlendirdi.
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="financial analysis tabs"
          variant="fullWidth"
        >
          <Tab label="Kredi Analizi" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Yatırım Getirisi" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Finansal Tavsiyeler" icon={<InfoIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Kredi Analizi Paneli */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper} sx={{ mb: 3, overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Kredi Senaryosu</strong></TableCell>
                <TableCell align="right"><strong>Peşinat</strong></TableCell>
                <TableCell align="right"><strong>Kredi Tutarı</strong></TableCell>
                <TableCell align="right"><strong>Vade (Ay)</strong></TableCell>
                <TableCell align="right"><strong>Aylık Taksit</strong></TableCell>
                <TableCell align="right"><strong>Toplam Ödeme</strong></TableCell>
                <TableCell align="right"><strong>Toplam Faiz</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mortgageAnalysis.loanScenarios.map((scenario, index) => (
                <TableRow 
                  key={index}
                  sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell component="th" scope="row">
                    <strong>%{scenario.downPaymentPercentage} Peşinat</strong>
                  </TableCell>
                  <TableCell align="right">{formatPrice(scenario.downPaymentAmount)}</TableCell>
                  <TableCell align="right">{formatPrice(scenario.loanAmount)}</TableCell>
                  <TableCell align="right">{scenario.term} ay</TableCell>
                  <TableCell align="right">{formatPrice(scenario.monthlyPayment)}</TableCell>
                  <TableCell align="right">{formatPrice(scenario.totalPayment)}</TableCell>
                  <TableCell align="right">{formatPrice(scenario.totalInterest)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kredi Senaryoları Karşılaştırması
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={loanComparisonData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                if (context.dataset.label === 'Toplam Faiz') {
                                  label += formatPrice(context.parsed.y * 1000);
                                } else {
                                  label += formatPrice(context.parsed.y);
                                }
                              }
                              return label;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'TL'
                          },
                          ticks: {
                            callback: function(value: any) {
                              if (typeof value === 'number') {
                                return formatPrice(value).replace(' TL', '');
                              }
                              return value;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Yatırım Getirisi Paneli */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kira Getirisi
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentsIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Aylık Kira
                        </Typography>
                        <Typography variant="h6">
                          {formatPrice(investmentAnalysis.rentalEstimate.monthlyRental)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaidIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Yıllık Kira
                        </Typography>
                        <Typography variant="h6">
                          {formatPrice(investmentAnalysis.rentalEstimate.annualRental)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PercentIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Kira Getiri Oranı
                        </Typography>
                        <Typography variant="h5" color="primary">
                          %{investmentAnalysis.rentalEstimate.rentalYield}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Yatırım Geri Dönüş Analizi
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Amorti Süresi
                        </Typography>
                        <Typography variant="h6">
                          {investmentAnalysis.breakEvenAnalysis.breakEvenPoint} yıl
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pozitif Nakit Akışı
                        </Typography>
                        <Typography variant="h6">
                          {investmentAnalysis.breakEvenAnalysis.cashFlowPositiveAfter} yıl sonra
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Değer Artış Tahmini
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PercentIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Yıllık Artış
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          %{investmentAnalysis.appreciationEstimate.annualAppreciationRate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HomeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          5 Yıl Sonra
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatPrice(investmentAnalysis.appreciationEstimate.valueAfter5Years)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HomeIcon fontSize="small" color="secondary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          10 Yıl Sonra
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatPrice(investmentAnalysis.appreciationEstimate.valueAfter10Years)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={appreciationData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += formatPrice(context.parsed.y);
                              }
                              return label;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          ticks: {
                            callback: function(value: any) {
                              if (typeof value === 'number') {
                                return formatPrice(value).replace(' TL', '') + ' TL';
                              }
                              return value;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Finansal Tavsiyeler Paneli */}
      <TabPanel value={tabValue} index={2}>
        <Paper elevation={2} sx={{ p: 3, bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
          <Typography variant="h6" gutterBottom>
            Finansal Tavsiyeler
          </Typography>
          <List>
            {financialAdvice.map((advice, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemIcon>
                  <InfoIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={advice} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default FinancialAnalysisPanel; 