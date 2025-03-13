import React, { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import BasicInfoTab from './BasicInfoTab';
import BuildingFeaturesTab from './BuildingFeaturesTab';
import AdditionalFeaturesTab from './AdditionalFeaturesTab';
import { SelectChangeEvent } from '@mui/material/Select';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface FormTabsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
  handleSwitchChange: (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormTabs: React.FC<FormTabsProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSwitchChange
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="form tabs"
            variant="fullWidth"
          >
            <Tab label="Temel Bilgiler" {...a11yProps(0)} />
            <Tab label="Bina Özellikleri" {...a11yProps(1)} />
            <Tab label="Ek Özellikler" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <BasicInfoTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange} 
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BuildingFeaturesTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange} 
            handleSwitchChange={handleSwitchChange} 
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AdditionalFeaturesTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSwitchChange={handleSwitchChange} 
          />
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default FormTabs; 