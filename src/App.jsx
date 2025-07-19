import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from '@mui/material';
import FilterModal from './components/FilterModal/FilterModal';
import Header from './components/Header/Header';
import MapView from './components/mapView/mapView';
import { getDesignTokens } from './theme';
import mockData from '../public/mockData.json'; // Assuming mockData is in public folder

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const theme = createTheme(getDesignTokens(darkMode ? 'dark' : 'light'));

  useEffect(() => {
    if (!filters) {
      setFilteredData(mockData.Data); // initial render
      return;
    }

    const { dateRange, difficulty, lengthRange, name } = filters;

    const newFiltered = mockData.Data.filter((item) => {
      // You can add real filtering logic here, but for now return all
      return true;
    });

    console.log('📊 Filtered result count:', newFiltered.length);
    setFilteredData(newFiltered);
  }, [filters]);

  const handleFormSubmit = (formData) => {
    setFilters(formData);
    setModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        toggleTheme={() => setDarkMode(!darkMode)}
        openModal={() => setModalOpen(true)}
      />
   <Container
  disableGutters
  maxWidth={false}
  sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
>
        {modalOpen ? (
          <FilterModal defaultValues={filters} onSubmit={handleFormSubmit} />
        ) : (
          <MapView data={filteredData} darkMode={darkMode} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
