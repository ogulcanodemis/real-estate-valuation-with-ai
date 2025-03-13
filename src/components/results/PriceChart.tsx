import React from 'react';
import { Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Property {
  id: number;
  title: string;
  price: number;
}

interface PriceChartProps {
  properties: Property[];
  estimatedPrice: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ properties, estimatedPrice }) => {
  // Grafik verileri - sadece geçerli fiyatı olan mülkleri kullan
  const validProperties = properties.filter(property => 
    property.price !== undefined && 
    property.price !== null && 
    !isNaN(property.price) && 
    property.price > 0
  );

  const chartData = {
    labels: [...validProperties.map(p => p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title), 'Tahmini Değer'],
    datasets: [
      {
        label: 'Fiyat (TL)',
        data: [...validProperties.map(p => p.price), estimatedPrice],
        backgroundColor: (context: any) => {
          // Tahmini değer için farklı renk kullan
          return context.dataIndex === validProperties.length 
            ? 'rgba(255, 99, 132, 0.7)' 
            : 'rgba(54, 162, 235, 0.5)';
        },
        borderColor: (context: any) => {
          return context.dataIndex === validProperties.length 
            ? 'rgba(255, 99, 132, 1)' 
            : 'rgba(54, 162, 235, 1)';
        },
        borderWidth: (context: any) => {
          return context.dataIndex === validProperties.length ? 2 : 1;
        },
      },
    ],
  };

  // Grafik seçenekleri
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Benzer Mülklerin Fiyat Karşılaştırması',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed.y);
            }
            return label;
          },
          title: function(context: any) {
            const index = context[0].dataIndex;
            return index === validProperties.length ? 'Tahmini Değer' : context[0].label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumSignificantDigits: 3 }).format(value);
          }
        }
      },
      x: {
        ticks: {
          font: {
            weight: (context: any) => {
              return context.index === validProperties.length ? 'bold' : 'normal';
            }
          }
        }
      }
    }
  };

  // Ortalama fiyat hesapla
  const averagePrice = validProperties.length > 0 
    ? validProperties.reduce((sum, property) => sum + property.price, 0) / validProperties.length 
    : 0;
  
  // Fiyat farkı yüzdesi hesapla
  const priceDifferencePercent = averagePrice > 0 
    ? ((estimatedPrice - averagePrice) / averagePrice * 100).toFixed(1) 
    : '0.0';
  const isPriceHigher = estimatedPrice > averagePrice;

  // Debug bilgisi
  console.log('Tüm benzer mülkler:', properties);
  console.log('Geçerli fiyatı olan mülkler:', validProperties);
  console.log('Ortalama fiyat:', averagePrice);
  console.log('Fiyat farkı yüzdesi:', priceDifferencePercent);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Fiyat Karşılaştırması
      </Typography>
      <Box sx={{ height: 300, mb: 2 }}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
      {averagePrice > 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tahmini değer, benzer mülklerin ortalamasından <strong style={{ color: isPriceHigher ? '#4caf50' : '#f44336' }}>
            {isPriceHigher ? '+' : ''}{priceDifferencePercent}%
          </strong> {isPriceHigher ? 'daha yüksek' : 'daha düşük'}.
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Benzer mülklerin fiyat ortalaması hesaplanamadı. Lütfen geçerli fiyatı olan benzer mülklerin olduğundan emin olun.
        </Typography>
      )}
    </>
  );
};

export default PriceChart; 