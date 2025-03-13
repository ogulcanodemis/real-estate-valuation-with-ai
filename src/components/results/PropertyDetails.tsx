import React from 'react';
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BalconyIcon from '@mui/icons-material/Balcony';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElevatorIcon from '@mui/icons-material/Elevator';
import WeekendIcon from '@mui/icons-material/Weekend';

interface PropertyDetailsProps {
  propertyDetails: {
    province: string;
    district: string;
    neighborhood: string;
    property_type: string;
    net_sqm: number;
    gross_sqm: number;
    room_count: string;
    building_age: string;
    floor_location: string;
    total_floors: number;
    heating_type: string;
    bathroom_count: number;
    balcony: boolean;
    parking: boolean;
    elevator: boolean;
    furnished: boolean;
    usage_status: string;
    dues: number;
    suitable_for_credit: boolean;
    deed_status: string;
  };
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyDetails }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Mülk Özellikleri
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" width="40%">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  Konum
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.province} / {propertyDetails.district} / {propertyDetails.neighborhood}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon fontSize="small" sx={{ mr: 1 }} />
                  Emlak Tipi
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.property_type}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SquareFootIcon fontSize="small" sx={{ mr: 1 }} />
                  Net / Brüt Alan
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.net_sqm} m² / {propertyDetails.gross_sqm} m²</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MeetingRoomIcon fontSize="small" sx={{ mr: 1 }} />
                  Oda Sayısı
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.room_count}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BathtubIcon fontSize="small" sx={{ mr: 1 }} />
                  Banyo Sayısı
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.bathroom_count}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ApartmentIcon fontSize="small" sx={{ mr: 1 }} />
                  Bina Yaşı
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.building_age}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ApartmentIcon fontSize="small" sx={{ mr: 1 }} />
                  Kat Bilgisi
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.floor_location} / {propertyDetails.total_floors}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalFireDepartmentIcon fontSize="small" sx={{ mr: 1 }} />
                  Isıtma Tipi
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.heating_type}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                  Aidat
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.dues} TL</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} />
                  Tapu Durumu
                </Box>
              </TableCell>
              <TableCell>{propertyDetails.deed_status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        {propertyDetails.balcony && (
          <Chip icon={<BalconyIcon />} label="Balkon" color="primary" variant="outlined" />
        )}
        {propertyDetails.parking && (
          <Chip icon={<DirectionsCarIcon />} label="Otopark" color="primary" variant="outlined" />
        )}
        {propertyDetails.elevator && (
          <Chip icon={<ElevatorIcon />} label="Asansör" color="primary" variant="outlined" />
        )}
        {propertyDetails.furnished && (
          <Chip icon={<WeekendIcon />} label="Eşyalı" color="primary" variant="outlined" />
        )}
        {propertyDetails.suitable_for_credit && (
          <Chip icon={<AccountBalanceIcon />} label="Krediye Uygun" color="primary" variant="outlined" />
        )}
      </Box>
    </>
  );
};

export default PropertyDetails; 