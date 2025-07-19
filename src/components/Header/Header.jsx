import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ toggleTheme, openModal }) => {
  const [dark, setDark] = React.useState(false);

  const handleThemeToggle = () => {
    setDark((prev) => !prev);
    toggleTheme();
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Vessel Tracker
        </Typography>

        <Box>
          <IconButton color="inherit" onClick={openModal} title="Open Filters">
            <FilterAltIcon />
          </IconButton>

          <IconButton color="inherit" onClick={handleThemeToggle} title="Toggle Theme">
            {dark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
