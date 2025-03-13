import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';

interface BuildingFeaturesTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
  handleSwitchChange: (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BuildingFeaturesTab: React.FC<BuildingFeaturesTabProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSwitchChange
}) => {
  const [floorLocations, setFloorLocations] = useState<string[]>([]);
  const [heatingTypes, setHeatingTypes] = useState<string[]>([]);
  const [usageStatuses, setUsageStatuses] = useState<string[]>([]);
  const [deedStatuses, setDeedStatuses] = useState<string[]>([]);
  
  const [floorLocationLoading, setFloorLocationLoading] = useState<boolean>(false);
  const [heatingTypeLoading, setHeatingTypeLoading] = useState<boolean>(false);
  const [usageStatusLoading, setUsageStatusLoading] = useState<boolean>(false);
  const [deedStatusLoading, setDeedStatusLoading] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kat konumlarını getir
    const fetchFloorLocations = async () => {
      setFloorLocationLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/floor-locations');
        setFloorLocations(response.data);
      } catch (error) {
        console.error('Kat konumları yüklenirken hata oluştu:', error);
        setError('Kat konumları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setFloorLocationLoading(false);
      }
    };

    // Isıtma tiplerini getir
    const fetchHeatingTypes = async () => {
      setHeatingTypeLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/heating-types');
        setHeatingTypes(response.data);
      } catch (error) {
        console.error('Isıtma tipleri yüklenirken hata oluştu:', error);
        setError('Isıtma tipleri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setHeatingTypeLoading(false);
      }
    };

    // Kullanım durumlarını getir
    const fetchUsageStatuses = async () => {
      setUsageStatusLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/usage-statuses');
        setUsageStatuses(response.data);
      } catch (error) {
        console.error('Kullanım durumları yüklenirken hata oluştu:', error);
        setError('Kullanım durumları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setUsageStatusLoading(false);
      }
    };

    // Tapu durumlarını getir
    const fetchDeedStatuses = async () => {
      setDeedStatusLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/deed-statuses');
        setDeedStatuses(response.data);
      } catch (error) {
        console.error('Tapu durumları yüklenirken hata oluştu:', error);
        setError('Tapu durumları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setDeedStatusLoading(false);
      }
    };

    fetchFloorLocations();
    fetchHeatingTypes();
    fetchUsageStatuses();
    fetchDeedStatuses();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel id="floor-location-label">Bulunduğu Kat</InputLabel>
          <Select
            labelId="floor-location-label"
            id="floor-location"
            name="floor_location"
            value={formData.floor_location}
            onChange={handleSelectChange}
            label="Bulunduğu Kat"
            required
          >
            {floorLocationLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              floorLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          id="total-floors"
          name="total_floors"
          label="Toplam Kat Sayısı"
          type="number"
          value={formData.total_floors}
          onChange={handleInputChange}
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="heating-type-label">Isıtma Tipi</InputLabel>
          <Select
            labelId="heating-type-label"
            id="heating-type"
            name="heating_type"
            value={formData.heating_type}
            onChange={handleSelectChange}
            label="Isıtma Tipi"
            required
          >
            {heatingTypeLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              heatingTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          id="bathroom-count"
          name="bathroom_count"
          label="Banyo Sayısı"
          type="number"
          value={formData.bathroom_count}
          onChange={handleInputChange}
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.balcony}
              onChange={handleSwitchChange('balcony')}
              name="balcony"
              color="primary"
            />
          }
          label="Balkon"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.parking}
              onChange={handleSwitchChange('parking')}
              name="parking"
              color="primary"
            />
          }
          label="Otopark"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.elevator}
              onChange={handleSwitchChange('elevator')}
              name="elevator"
              color="primary"
            />
          }
          label="Asansör"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.furnished}
              onChange={handleSwitchChange('furnished')}
              name="furnished"
              color="primary"
            />
          }
          label="Eşyalı"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="usage-status-label">Kullanım Durumu</InputLabel>
          <Select
            labelId="usage-status-label"
            id="usage-status"
            name="usage_status"
            value={formData.usage_status}
            onChange={handleSelectChange}
            label="Kullanım Durumu"
          >
            {usageStatusLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              usageStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          id="dues"
          name="dues"
          label="Aidat (TL)"
          type="number"
          value={formData.dues}
          onChange={handleInputChange}
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.suitable_for_credit}
              onChange={handleSwitchChange('suitable_for_credit')}
              name="suitable_for_credit"
              color="primary"
            />
          }
          label="Krediye Uygun"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="deed-status-label">Tapu Durumu</InputLabel>
          <Select
            labelId="deed-status-label"
            id="deed-status"
            name="deed_status"
            value={formData.deed_status}
            onChange={handleSelectChange}
            label="Tapu Durumu"
          >
            {deedStatusLoading ? (
              <MenuItem disabled>Yükleniyor...</MenuItem>
            ) : (
              deedStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default BuildingFeaturesTab; 