import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BalconyIcon from '@mui/icons-material/Balcony';
import ElevatorIcon from '@mui/icons-material/Elevator';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WeekendIcon from '@mui/icons-material/Weekend';
import InfoIcon from '@mui/icons-material/Info';

interface Property {
  id: number;
  listing_id: string;
  title: string;
  description: string;
  price: number;
  province: string;
  district: string;
  neighborhood: string;
  property_type: string;
  gross_sqm: number;
  net_sqm: number;
  room_count: string;
  building_age: string;
  floor_location: string;
  total_floors: number;
  heating_type: string;
  bathroom_count: number;
  balcony: string;
  elevator: string;
  parking: string;
  furnished: string;
  usage_status: string;
  dues: number;
  suitable_for_credit: string;
  deed_status: string;
  trade: string;
  interior_features?: string;
  exterior_features?: string;
  front_features?: string;
  neighborhood_features?: string;
  transportation_features?: string;
  view_features?: string;
  seller_name?: string;
  seller_phone_office?: string;
  seller_phone_mobile?: string;
  seller_company_name?: string;
  listing_date?: string;
}

interface PropertySliderProps {
  properties: Property[];
  formatPrice: (price: number) => string;
}

const PropertySlider: React.FC<PropertySliderProps> = ({ properties, formatPrice }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (property: Property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Özellik var mı kontrol et
  const hasFeature = (value: string | null | undefined): boolean => {
    if (!value) return false;
    const lowerValue = value.toLowerCase();
    return lowerValue.includes('var') || 
           lowerValue.includes('mevcut') || 
           lowerValue.includes('evet') ||
           lowerValue === 'true';
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Benzer Mülkler
      </Typography>
      
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative'
        }}>
          <IconButton 
            sx={{ 
              position: 'absolute', 
              left: -20, 
              zIndex: 2, 
              bgcolor: 'background.paper', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
            onClick={(e) => {
              const container = e.currentTarget.parentElement?.querySelector('.slider-container');
              if (container) {
                container.scrollLeft -= 300;
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <Box 
            className="slider-container"
            sx={{ 
              display: 'flex', 
              gap: 2, 
              overflowX: 'auto', 
              scrollBehavior: 'smooth',
              pb: 2,
              px: 1,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.main',
                borderRadius: 4,
              }
            }}
          >
            {properties.map((property) => (
              <Card key={property.id} sx={{ minWidth: 300, maxWidth: 300, flex: '0 0 auto' }} className="property-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {property.title}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatPrice(property.price)}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2" noWrap>
                        {property.province} / {property.district} / {property.neighborhood}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HomeIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2">{property.property_type}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SquareFootIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2">{property.net_sqm} m² (Net) / {property.gross_sqm} m² (Brüt)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MeetingRoomIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2">{property.room_count}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BathtubIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2">{property.bathroom_count} Banyo</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2">{property.building_age}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalFireDepartmentIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2">{property.heating_type}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {hasFeature(property.balcony) && (
                      <Chip icon={<BalconyIcon />} label="Balkon" size="small" variant="outlined" />
                    )}
                    {hasFeature(property.elevator) && (
                      <Chip icon={<ElevatorIcon />} label="Asansör" size="small" variant="outlined" />
                    )}
                    {hasFeature(property.parking) && (
                      <Chip icon={<DirectionsCarIcon />} label="Otopark" size="small" variant="outlined" />
                    )}
                    {hasFeature(property.furnished) && (
                      <Chip icon={<WeekendIcon />} label="Eşyalı" size="small" variant="outlined" />
                    )}
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    fullWidth
                    onClick={() => handleClickOpen(property)}
                    startIcon={<InfoIcon />}
                  >
                    Detayları Gör
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <IconButton 
            sx={{ 
              position: 'absolute', 
              right: -20, 
              zIndex: 2, 
              bgcolor: 'background.paper', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
            onClick={(e) => {
              const container = e.currentTarget.parentElement?.querySelector('.slider-container');
              if (container) {
                container.scrollLeft += 300;
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Detay Diyaloğu */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedProperty && (
          <>
            <DialogTitle>
              {selectedProperty.title}
              <Typography variant="h6" color="primary">
                {formatPrice(selectedProperty.price)}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Temel Bilgiler</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" width="40%">İl / İlçe / Mahalle</TableCell>
                        <TableCell>{selectedProperty.province} / {selectedProperty.district} / {selectedProperty.neighborhood}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Emlak Tipi</TableCell>
                        <TableCell>{selectedProperty.property_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Net / Brüt Alan</TableCell>
                        <TableCell>{selectedProperty.net_sqm} m² / {selectedProperty.gross_sqm} m²</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Oda Sayısı</TableCell>
                        <TableCell>{selectedProperty.room_count}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Banyo Sayısı</TableCell>
                        <TableCell>{selectedProperty.bathroom_count}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Bina Yaşı</TableCell>
                        <TableCell>{selectedProperty.building_age}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Kat</TableCell>
                        <TableCell>{selectedProperty.floor_location} / {selectedProperty.total_floors}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Isıtma</TableCell>
                        <TableCell>{selectedProperty.heating_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Aidat</TableCell>
                        <TableCell>{selectedProperty.dues} TL</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Tapu Durumu</TableCell>
                        <TableCell>{selectedProperty.deed_status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Kullanım Durumu</TableCell>
                        <TableCell>{selectedProperty.usage_status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Krediye Uygun</TableCell>
                        <TableCell>{selectedProperty.suitable_for_credit}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">İlan Tarihi</TableCell>
                        <TableCell>{selectedProperty.listing_date}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Özellikler</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">İç Özellikler:</Typography>
                    <Typography variant="body2">{selectedProperty.interior_features || "Belirtilmemiş"}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">Dış Özellikler:</Typography>
                    <Typography variant="body2">{selectedProperty.exterior_features || "Belirtilmemiş"}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">Cephe:</Typography>
                    <Typography variant="body2">{selectedProperty.front_features || "Belirtilmemiş"}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">Çevre Özellikleri:</Typography>
                    <Typography variant="body2">{selectedProperty.neighborhood_features || "Belirtilmemiş"}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">Ulaşım:</Typography>
                    <Typography variant="body2">{selectedProperty.transportation_features || "Belirtilmemiş"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Manzara:</Typography>
                    <Typography variant="body2">{selectedProperty.view_features || "Belirtilmemiş"}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Açıklama</Typography>
                  <Typography variant="body2">{selectedProperty.description}</Typography>
                </Grid>
                
                {selectedProperty.seller_name && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Satıcı Bilgileri</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {selectedProperty.seller_name && (
                        <Typography variant="body2">İsim: {selectedProperty.seller_name}</Typography>
                      )}
                      {selectedProperty.seller_company_name && (
                        <Typography variant="body2">Firma: {selectedProperty.seller_company_name}</Typography>
                      )}
                      {selectedProperty.seller_phone_office && (
                        <Typography variant="body2">Ofis Tel: {selectedProperty.seller_phone_office}</Typography>
                      )}
                      {selectedProperty.seller_phone_mobile && (
                        <Typography variant="body2">Cep Tel: {selectedProperty.seller_phone_mobile}</Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Kapat</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PropertySlider; 