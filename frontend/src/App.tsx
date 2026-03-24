import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TripPlanningPage from "./pages/TripPlanning";
import TripDetailsPage from "./pages/TripDetailsPage";
import FeedPage from "./pages/FeedPage";
import ChatPage from "./pages/ChatPage";

import ProfilePage from "./pages/ProfilePage";

const theme = createTheme({
    palette: {
        primary: { main: "#507B00" },
        secondary: { main: "#95C22B" },
        warning: { main: "#F5A623" },
        info: { main: "#2979FF" },
        background: {
            default: "#F5F3EF",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#28430A",
            secondary: "#63371E",
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/search" element={<TripPlanningPage />} />
                        <Route path="/trip/:id" element={<TripDetailsPage />} />
                        <Route path="/feed" element={<FeedPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/chat/:id" element={<ChatPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;