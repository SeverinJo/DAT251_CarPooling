import { type ReactNode, useState, type MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Menu,
    MenuItem,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExploreIcon from "@mui/icons-material/Explore";
import SearchIcon from "@mui/icons-material/Search";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const feedSubItems = [
    { label: "My Carpoolers", icon: <PeopleIcon />, path: "/feed/carpoolers" },
    { label: "My Groups", icon: <Diversity3Icon />, path: "/feed/groups" },
    { label: "Discover Groups", icon: <ExploreIcon />, path: "/feed/discover" },
];

const newTripSubItems = [
    { label: "Find a Trip", icon: <SearchIcon />, path: "/trip/search" },
    { label: "Offer a Seat", icon: <AirlineSeatReclineNormalIcon />, path: "/trip/offer" },
];

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [feedAnchor, setFeedAnchor] = useState<null | HTMLElement>(null);
    const [tripAnchor, setTripAnchor] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [feedExpanded, setFeedExpanded] = useState(false);
    const [tripExpanded, setTripExpanded] = useState(false);

    const isActive = (path: string) => location.pathname.startsWith(path);

    const buttonSx = (path: string) => ({
        color: isActive(path) ? "primary.main" : "text.secondary",
        fontWeight: isActive(path) ? 700 : 400,
        textTransform: "none" as const,
        mr: 1,
    });

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            <AppBar position="sticky" elevation={1} sx={{ bgcolor: "background.paper", color: "text.primary" }} >
                <Toolbar sx={{ width: "100%", px: { xs: 1, md: 3 }} }>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "primary.main", mr: 4, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        EverybodyGo
                    </Typography>

                    {isMobile ? (
                        <Box sx={{ ml: "auto" }}>
                            <IconButton onClick={() => setDrawerOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ ml: "auto", display: "flex" }}>
                                <Button
                                    startIcon={<GroupIcon />}
                                    sx={buttonSx("/feed")}
                                    onClick={(e: MouseEvent<HTMLElement>) => { setFeedAnchor(e.currentTarget); setTripAnchor(null); }}
                                >
                                    Feed
                                </Button>
                                <Menu
                                    anchorEl={feedAnchor}
                                    open={Boolean(feedAnchor)}
                                    onClose={() => setFeedAnchor(null)}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                                    slotProps={{
                                        paper: {
                                            onMouseLeave: () => setFeedAnchor(null),
                                            onMouseEnter: () => setTripAnchor(null),
                                        }
                                    }}
                                    disableScrollLock
                                >
                                    {feedSubItems.map((item) => (
                                        <MenuItem
                                            key={item.path}
                                            onClick={() => { navigate(item.path); setFeedAnchor(null); }}
                                            selected={location.pathname === item.path}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Menu>

                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={buttonSx("/trip")}
                                    onClick={(e: MouseEvent<HTMLElement>) => { setTripAnchor(e.currentTarget); setFeedAnchor(null); }}
                                >
                                    New Trip
                                </Button>
                                <Menu
                                    anchorEl={tripAnchor}
                                    open={Boolean(tripAnchor)}
                                    onClose={() => setTripAnchor(null)}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                                    slotProps={{
                                        paper: {
                                            onMouseLeave: () => setTripAnchor(null),
                                            onMouseEnter: () => setFeedAnchor(null),
                                        }
                                    }}
                                    disableScrollLock
                                >
                                    {newTripSubItems.map((item) => (
                                        <MenuItem
                                            key={item.path}
                                            onClick={() => { navigate(item.path); setTripAnchor(null); }}
                                            selected={location.pathname === item.path}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Menu>

                                <Button
                                    startIcon={<ChatIcon />}
                                    sx={buttonSx("/chat")}
                                    onClick={() => navigate("/chat")}
                                    onMouseEnter={() => { setFeedAnchor(null); setTripAnchor(null); }}
                                >
                                    Chat
                                </Button>
                                <Button
                                    startIcon={<PersonIcon />}
                                    sx={buttonSx("/profile")}
                                    onClick={() => navigate("/profile")}
                                    onMouseEnter={() => { setFeedAnchor(null); setTripAnchor(null); }}
                                >
                                    Profile
                                </Button>
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 260, pt: 2 }}>
                    <Typography variant="h6" sx={{ px: 2, pb: 2, fontWeight: 700, color: "primary.main" }}>
                        EverybodyGo
                    </Typography>

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setFeedExpanded(!feedExpanded)}>
                                <ListItemIcon><GroupIcon /></ListItemIcon>
                                <ListItemText primary="Feed" />
                                {feedExpanded ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={feedExpanded}>
                            <List disablePadding>
                                {feedSubItems.map((item) => (
                                    <ListItem key={item.path} disablePadding>
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            selected={location.pathname === item.path}
                                            onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setTripExpanded(!tripExpanded)}>
                                <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                                <ListItemText primary="New Trip" />
                                {tripExpanded ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={tripExpanded}>
                            <List disablePadding>
                                {newTripSubItems.map((item) => (
                                    <ListItem key={item.path} disablePadding>
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            selected={location.pathname === item.path}
                                            onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>

                        <ListItem disablePadding>
                            <ListItemButton
                                selected={isActive("/chat")}
                                onClick={() => { navigate("/chat"); setDrawerOpen(false); }}
                            >
                                <ListItemIcon><ChatIcon /></ListItemIcon>
                                <ListItemText primary="Chat" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                selected={isActive("/profile")}
                                onClick={() => { navigate("/profile"); setDrawerOpen(false); }}
                            >
                                <ListItemIcon><PersonIcon /></ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ flex: 1, width: "100%" }}>
                {children}
            </Box>
        </Box>
    );
}