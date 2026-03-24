import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TripPlanningPage from "./pages/TripPlanning";
import ProfilePage from "./pages/ProfilePage";

const theme = createTheme({
    palette: {
        primary: { main: "#507B00" },
        secondary: { main: "#95C22B" },
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
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/trip" element={<TripPlanningPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;