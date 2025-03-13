import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar>
          <HomeIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Emlak Değerleme
          </Typography>

          {isMobile ? (
            <Box>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem 
                  component={RouterLink} 
                  to="/" 
                  onClick={handleClose}
                >
                  Ana Sayfa
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/estimate" 
                  onClick={handleClose}
                >
                  Değerleme
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/about" 
                  onClick={handleClose}
                >
                  Hakkında
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex' }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
              >
                Ana Sayfa
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/estimate"
              >
                Değerleme
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/about"
              >
                Hakkında
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 