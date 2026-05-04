import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { register } from "../api/api";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(username, email, password);
            navigate("/login");
        } catch {
            setError("Registration failed. Username or email may already be taken.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
                    <Stack spacing={2} component="form" onSubmit={handleRegister}>
                        <Typography variant="h4" component="h1">
                            Create account
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{" "}
                            <Box component="span"
                                onClick={() => navigate("/login")}
                                sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
                            >
                                Log in
                            </Box>
                        </Typography>

                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label="Username"
                            type="text"
                            fullWidth
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button variant="contained" size="large" fullWidth type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
}