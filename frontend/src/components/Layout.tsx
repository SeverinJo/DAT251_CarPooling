import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

const navItems = [
    { label: "Feed", icon: <GroupIcon />, path: "/" },
    { label: "New Trip", icon: <AddCircleOutlineIcon />, path: "/new-trip" },
    { label: "Chat", icon: <ChatIcon />, path: "/chat" },
    { label: "Profile", icon: <PersonIcon />, path: "/profile" },
];

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            <AppBar position="sticky" elevation={1} sx={{ bgcolor: "background.paper", color: "text.primary" }}>
                <Toolbar sx={{ width: "100%", px: { xs: 1, md: 3 } }}>
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

            <Box sx={{ flex: 1, width: "100%" }}>
                {children}
            </Box>
        </Box>
    );
}