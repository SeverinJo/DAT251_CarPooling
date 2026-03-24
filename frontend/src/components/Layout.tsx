import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";

const navItems = [
    { label: "Search", icon: <SearchIcon />, path: "/" },
    { label: "Bookings", icon: <BookmarkIcon />, path: "/bookings" },
    { label: "Profile", icon: <PersonIcon />, path: "/profile" },
];

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f5f5" }}>
            <AppBar position="sticky" elevation={1} sx={{ bgcolor: "background.paper", color: "text.primary" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mr: 4 }}>
                        EverybodyGo
                    </Typography>
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            startIcon={item.icon}
                            onClick={() => navigate(item.path)}
                            sx={{
                                color: location.pathname === item.path ? "primary.main" : "text.secondary",
                                fontWeight: location.pathname === item.path ? 700 : 400,
                                textTransform: "none",
                                mr: 1,
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1 }}>
                {children}
            </Box>
        </Box>
    );
}