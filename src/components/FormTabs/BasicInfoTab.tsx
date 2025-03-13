import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';

interface BasicInfoTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, handleInputChange, handleSelectChange }) => {
  const [districts, setDistricts] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [roomCounts, setRoomCounts] = useState<string[]>([]);
  const [buildingAges, setBuildingAges] = useState<string[]>([]);
  
  const [districtLoading, setDistrictLoading] = useState<boolean>(false);
  const [neighborhoodLoading, setNeighborhoodLoading] = useState<boolean>(false);
  const [propertyTypeLoading, setPropertyTypeLoading] = useState<boolean>(false);
  const [provinceLoading, setProvinceLoading] = useState<boolean>(false);
  const [roomCountLoading, setRoomCountLoading] = useState<boolean>(false);
  const [buildingAgeLoading, setBuildingAgeLoading] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // İlleri getir
    const fetchProvinces = async () => {
      setProvinceLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/provinces');
        setProvinces(response.data);
      } catch (error) {
        console.error('İller yüklenirken hata oluştu:', error);
        setError('İller yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setProvinceLoading(false);
      }
    };

    // İlçeleri getir
    const fetchDistricts = async () => {
      setDistrictLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/districts');
        setDistricts(response.data);
      } catch (error) {
        console.error('İlçeler yüklenirken hata oluştu:', error);
        setError('İlçeler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setDistrictLoading(false);
      }
    };

    // Emlak tiplerini getir
    const fetchPropertyTypes = async () => {
      setPropertyTypeLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/property-types');
        setPropertyTypes(response.data);
      } catch (error) {
        console.error('Emlak tipleri yüklenirken hata oluştu:', error);
        setError('Emlak tipleri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setPropertyTypeLoading(false);
      }
    };
    
    // Oda sayılarını getir
    const fetchRoomCounts = async () => {
      setRoomCountLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/room-counts');
        setRoomCounts(response.data);
      } catch (error) {
        console.error('Oda sayıları yüklenirken hata oluştu:', error);
        setError('Oda sayıları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setRoomCountLoading(false);
      }
    };
    
    // Bina yaşlarını getir
    const fetchBuildingAges = async () => {
      setBuildingAgeLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/building-ages');
        setBuildingAges(response.data);
      } catch (error) {
        console.error('Bina yaşları yüklenirken hata oluştu:', error);
        setError('Bina yaşları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setBuildingAgeLoading(false);
      }
    };

    fetchProvinces();
    fetchDistricts();
    fetchPropertyTypes();
    fetchRoomCounts();
    fetchBuildingAges();
  }, []);

  // Seçilen ilçeye göre mahalleleri getir
  useEffect(() => {
    if (formData.district) {
      const fetchNeighborhoods = async () => {
        setNeighborhoodLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/api/neighborhoods/${formData.district}`);
          setNeighborhoods(response.data);
        } catch (error) {
          console.error('Mahalleler yüklenirken hata oluştu:', error);
          setError('Mahalleler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        } finally {
          setNeighborhoodLoading(false);
        }
      };

      fetchNeighborhoods();
    } else {
      setNeighborhoods([]);
    }
  }, [formData.district]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel id="province-label">İl</InputLabel>
          <Select
            labelId="province-label"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleSelectChange}
            label="İl"
            required
          >
            {provinceLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              provinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel id="property-type-label">Emlak Tipi</InputLabel>
          <Select
            labelId="property-type-label"
            id="property-type"
            name="property_type"
            value={formData.property_type}
            onChange={handleSelectChange}
            label="Emlak Tipi"
            required
          >
            {propertyTypeLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel id="district-label">İlçe</InputLabel>
          <Select
            labelId="district-label"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleSelectChange}
            label="İlçe"
            required
          >
            {districtLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="neighborhood-label">Mahalle</InputLabel>
          <Select
            labelId="neighborhood-label"
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleSelectChange}
            label="Mahalle"
            disabled={!formData.district || neighborhoodLoading}
          >
            {neighborhoodLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : !formData.district ? (
              <MenuItem disabled>Önce ilçe seçin</MenuItem>
            ) : (
              neighborhoods.map((neighborhood) => (
                <MenuItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          id="net-sqm"
          name="net_sqm"
          label="Net Alan (m²)"
          type="number"
          value={formData.net_sqm}
          onChange={handleInputChange}
          InputProps={{ inputProps: { min: 1 } }}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          id="gross-sqm"
          name="gross_sqm"
          label="Brüt Alan (m²)"
          type="number"
          value={formData.gross_sqm}
          onChange={handleInputChange}
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel id="room-count-label">Oda Sayısı</InputLabel>
          <Select
            labelId="room-count-label"
            id="room-count"
            name="room_count"
            value={formData.room_count}
            onChange={handleSelectChange}
            label="Oda Sayısı"
            required
          >
            {roomCountLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              roomCounts.map((count) => (
                <MenuItem key={count} value={count}>
                  {count}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel id="building-age-label">Bina Yaşı</InputLabel>
          <Select
            labelId="building-age-label"
            id="building-age"
            name="building_age"
            value={formData.building_age}
            onChange={handleSelectChange}
            label="Bina Yaşı"
            required
          >
            {buildingAgeLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              buildingAges.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default BasicInfoTab; 