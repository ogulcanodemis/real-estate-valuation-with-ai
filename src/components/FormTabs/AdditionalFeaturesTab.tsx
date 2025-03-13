import React from 'react';
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';

interface AdditionalFeaturesTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalFeaturesTab: React.FC<AdditionalFeaturesTabProps> = ({
  formData,
  handleInputChange,
  handleSwitchChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="interior-features"
          name="interior_features"
          label="İç Özellikler"
          multiline
          rows={3}
          value={formData.interior_features}
          onChange={handleInputChange}
          placeholder="Örn: Ankastre, Gömme Dolap, Duşakabin, Hilton Banyo, Jakuzi, Kartonpiyer, Şömine, Çelik Kapı, Vestiyer, vb."
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="exterior-features"
          name="exterior_features"
          label="Dış Özellikler"
          multiline
          rows={3}
          value={formData.exterior_features}
          onChange={handleInputChange}
          placeholder="Örn: Güvenlik, Kapalı Garaj, Oyun Parkı, Spor Alanı, Süs Havuzu, Tenis Kortu, Yangın Merdiveni, Yüzme Havuzu, vb."
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="view-features"
          name="view_features"
          label="Manzara Özellikleri"
          multiline
          rows={3}
          value={formData.view_features}
          onChange={handleInputChange}
          placeholder="Örn: Boğaz, Deniz, Doğa, Göl, Havuz, Park, Şehir, vb."
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="transportation"
          name="transportation"
          label="Ulaşım"
          multiline
          rows={3}
          value={formData.transportation}
          onChange={handleInputChange}
          placeholder="Örn: Anayol, Cadde, E-5, Havaalanı, Metro, Metrobüs, Minibüs, Otobüs Durağı, TEM, Tramvay, vb."
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="neighborhood"
          name="neighborhood_features"
          label="Çevre Özellikleri"
          multiline
          rows={3}
          value={formData.neighborhood_features}
          onChange={handleInputChange}
          placeholder="Örn: Alışveriş Merkezi, Belediye, Cami, Cemevi, Eczane, Eğlence Merkezi, Hastane, İlkokul, Kilise, Lise, Market, Park, Polis Merkezi, Sağlık Ocağı, Semt Pazarı, Spor Salonu, Üniversite, vb."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.sea_view}
              onChange={handleSwitchChange('sea_view')}
              name="sea_view"
              color="primary"
            />
          }
          label="Deniz Manzarası"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.nature_view}
              onChange={handleSwitchChange('nature_view')}
              name="nature_view"
              color="primary"
            />
          }
          label="Doğa Manzarası"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.near_transportation}
              onChange={handleSwitchChange('near_transportation')}
              name="near_transportation"
              color="primary"
            />
          }
          label="Toplu Ulaşıma Yakın"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.near_market}
              onChange={handleSwitchChange('near_market')}
              name="near_market"
              color="primary"
            />
          }
          label="Markete Yakın"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.near_hospital}
              onChange={handleSwitchChange('near_hospital')}
              name="near_hospital"
              color="primary"
            />
          }
          label="Hastaneye Yakın"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.near_school}
              onChange={handleSwitchChange('near_school')}
              name="near_school"
              color="primary"
            />
          }
          label="Okula Yakın"
        />
      </Grid>
    </Grid>
  );
};

export default AdditionalFeaturesTab; 