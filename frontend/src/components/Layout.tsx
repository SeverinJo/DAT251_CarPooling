import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    ButtonBase,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";

const navItems = [
    { label: "Feed", icon: <GroupIcon fontSize="small" />, path: "/" },
    { label: "New Trip", icon: <AddCircleOutlineIcon fontSize="small" />, path: "/new-trip" },
    { label: "Chat", icon: <ChatIcon fontSize="small" />, path: "/chat" },
    { label: "Profile", icon: <PersonIcon fontSize="small" />, path: "/profile" },
];

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid",
                    borderColor: "rgba(80,123,0,0.12)",
                    color: "text.primary",
                }}
            >
                <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                    {/* Logo */}
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <EnergySavingsLeafIcon sx={{ color: "primary.main", fontSize: 28 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                                color: "primary.main",
                                lineHeight: 1,
                            }}
                        >
                            EverybodyGo
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    {/* Nav items */}
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {navItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <ButtonBase
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        px: 1.5,
                                        py: 0.75,
                                        borderRadius: 2,
                                        fontSize: "0.875rem",
                                        fontWeight: active ? 700 : 500,
                                        color: active ? "primary.main" : "text.secondary",
                                        bgcolor: active ? "rgba(80,123,0,0.08)" : "transparent",
                                        transition: "all 0.15s ease",
                                        "&:hover": {
                                            bgcolor: "rgba(80,123,0,0.06)",
                                            color: "primary.main",
                                        },
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </ButtonBase>
                            );
                        })}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, width: "100%" }}>
                {children}
            </Box>
        </Box>
    );
}