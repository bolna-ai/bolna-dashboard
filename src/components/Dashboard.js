import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Box, Toolbar, AppBar, ListItemSecondaryAction, Badge, Avatar } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Popover, MenuItem, Stack, ListSubheader, ListItemButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group'; // Icon for "My Agents"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for "Create Agents"
import InsightsIcon from '@mui/icons-material/Insights'; // Icon for "Models"
import StorageIcon from '@mui/icons-material/Storage'; // Icon for "Datasets"
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'; // Icon for "Integrations"
import DataObjectIcon from '@mui/icons-material/DataObject';
import PaymentIcon from '@mui/icons-material/Payment';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import SupportIcon from '@mui/icons-material/Support';
import CreditDialog from './CreditDialog';
import { Mixpanel } from '../utils/mixpanel';

const drawerWidth = 240;
const MENU_OPTIONS = [
    {
      label: 'Add More Credits',
      icon: 'eva:home-fill',
      action: 'ADD_CREDITS'
    }
  ];

function Dashboard({ supabase, accessToken, userInfo=null }) {
    //console.log("accessToken1", accessToken);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(null);
    const [openCreditDialog, setOpenCreditDialog] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logoutUser = () => {
        Mixpanel.identify(userInfo.user_id);
        Mixpanel.track('logout');
        supabase.auth.signOut().then(() => {
            alert("Logged out")
            navigate("/");
        })
    }

    const handleAccountOpen = (event) => {
        Mixpanel.identify(userInfo.user_id);
        Mixpanel.track('open_profile');
        setAccountOpen(event.currentTarget);
      };

      const handleAccountClose = () => {
        setAccountOpen(null);
      };

      const handleMenuItemClick = (action) => {
        if (action === 'ADD_CREDITS') {
            Mixpanel.identify(userInfo.user_id);
            Mixpanel.track('click_profile_add_credits');
            setOpenCreditDialog(true);
        }
      };

      const handleCreditCloseDialog = () => {
        setOpenCreditDialog(false);
        setAccountOpen(null);
      };

      const handleNavLinkClick = (e) => {
        //console.log(e.target.innerText);
        // Track event using Mixpanel
        Mixpanel.track('nav_item_clicked', {
          item: e.target.innerText
        });
      };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <ListItem button component={NavLink} to="my-agents" onClick={handleNavLinkClick}>
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary="My Agents" />
                </ListItem>
                <ListItem button component={NavLink} to="create-agents" onClick={handleNavLinkClick}>
                    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                    <ListItemText primary="Create Agents" />
                </ListItem>
                <ListItem button component={NavLink} to="models" onClick={handleNavLinkClick}>
                    <ListItemIcon><InsightsIcon /></ListItemIcon>
                    <ListItemText primary="Models" />
                </ListItem>
                <ListItem button component={NavLink} to="datasets" onClick={handleNavLinkClick}>
                    <ListItemIcon><StorageIcon /></ListItemIcon>
                    <ListItemText primary="Datasets" />
                    <ListItemSecondaryAction sx={{ right: '20%' }} color="info">
                        <Badge
                            badgeContent="Soon"
                            color="info"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem button component={NavLink} to="integrations" onClick={handleNavLinkClick}>
                    <ListItemIcon><SettingsInputComponentIcon /></ListItemIcon>
                    <ListItemText primary="Integrations" />
                    <ListItemSecondaryAction sx={{ right: '20%'}}>
                        <Badge
                            badgeContent={<Typography variant="body6">Soon</Typography>}
                            color="info"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={NavLink} to="developer" onClick={handleNavLinkClick}>
                    <ListItemIcon><DataObjectIcon /></ListItemIcon>
                    <ListItemText primary="Developer" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => setOpenCreditDialog(true)}>
                    <ListItemIcon><PaymentIcon /></ListItemIcon>
                    <ListItemText primary="Add Credits" />
                </ListItem>
            </List>
            <CreditDialog open={openCreditDialog} handleClose={handleCreditCloseDialog} userInfo={userInfo} source={"navitem"} accessToken={accessToken} />

            <Divider />


          <List component="nav" sx={{ display: 'flex'}}>
            <ListItem disablePadding>
              <ListItemButton component="a" target="_blank" href="https://bolna.canny.io/">
                  <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1, pb: 0 }}>
                    <LiveHelpIcon /> {/* Use the icon component */}
                  </ListItemIcon>

                <ListItemText primary={<Typography variant="caption">FAQs</Typography>} onClick={handleNavLinkClick} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" target="_blank" href="https://docs.bolna.dev">
                  <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1, pb: 0 }}>
                    <ArticleIcon /> {/* Use the icon component */}
                  </ListItemIcon>

                <ListItemText sx={{ lineHeight: 0.5 }} primary={<Typography variant="caption">Read Docs</Typography>} onClick={handleNavLinkClick} />
              </ListItemButton>
            </ListItem>
          </List>
          <List component="nav" sx={{ display: 'flex', m: 0, p:0 }}>
            <ListItem disablePadding>
              <ListItemButton component="a" target="_blank" href="https://discord.gg/yDfcqreByj">
                  <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1, pb: 0 }}>
                    <ChatIcon /> {/* Use the icon component */}
                  </ListItemIcon>
                <ListItemText primary={<Typography variant="caption">Chat on Discord</Typography>} onClick={handleNavLinkClick} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" target="_blank" href="https://forms.gle/xaeX5CpN6L9i64hE6">
                <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1, pb: 0 }}>
                    <SupportIcon /> {/* Use the icon component */}
                </ListItemIcon>
                <ListItemText sx={{ pb: 0 }} primary={<Typography variant="caption">Contact Us</Typography>} onClick={handleNavLinkClick} />
              </ListItemButton>
            </ListItem>
          </List>

        </div>
    );

    const pageTitle = useMemo(() => {
        const path = location.pathname.split("/").pop();
        switch (path) {
            case 'my-agents':
                return 'My Agents';
            case 'create-agents':
                return 'Create Agents';
            case 'models':
                return 'Models';
            case 'datasets':
                return 'Datasets';
            case 'integrations':
                return 'Integrations';
            case 'developer':
                return 'Developer';
            default:
                return 'Dashboard';
        }
    }, [location]);


    return (
        <Box component="main" sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" noWrap>
                        {pageTitle}
                    </Typography>
                    <div style={{ flexGrow: 1 }} /> {/* This will push the text to the right */}

                    <Typography variant="body1" noWrap sx={{ marginRight: 5 }}>
                        Credits: {userInfo?.wallet || 0}
                    </Typography>

                    <IconButton
                        onClick={handleAccountOpen}
                        sx={{
                        width: 40,
                        height: 40,
                        ...(accountOpen && {
                            background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        }),
                        }}
                    >
                        <Avatar
                        src=""
                        alt={userInfo?.user_info?.name || ''}
                        sx={{
                            width: 36,
                            height: 36,
                            border: (theme) => `solid 2px ${theme.palette.background.default}`,
                        }}
                        >
                        {userInfo?.user_info?.name ? userInfo?.user_info?.name.charAt(0).toUpperCase() : userInfo?.user_info?.email.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>

                    <Popover
                        open={!!accountOpen}
                        anchorEl={accountOpen}
                        onClose={handleAccountClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                        sx: {
                            p: 0,
                            mt: 1,
                            ml: 0.75,
                            width: 200,
                        },
                        }}

                        >
                        <Box sx={{ my: 1.5, px: 2 }}>
                        <Typography variant="subtitle2" noWrap>
                            {userInfo?.user_info?.name || ''}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {userInfo?.user_info?.email || ''}
                        </Typography>
                        </Box>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={() => handleMenuItemClick(option.action)}>
                            {option.label}
                        </MenuItem>
                        ))}

                        <CreditDialog open={openCreditDialog} handleClose={handleCreditCloseDialog} userInfo={userInfo} source={"dropdown"} accessToken={accessToken} />

                        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

                        <MenuItem
                        disableRipple
                        disableTouchRipple
                        onClick={logoutUser}
                        sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
                        >
                        Logout
                        </MenuItem>
                    </Popover>

                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Dashboard;
