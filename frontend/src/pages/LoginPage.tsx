import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Divider, Paper, Stack, TextField, Typography, Alert } from "@mui/material";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const params = new URLSearchParams({ username, password });
            const res = await fetch(`/login?${params}`, { method: "POST" });
            if (!res.ok) {
                setError("Invalid username or password");
                return;
            }
            const token = await res.text();
            localStorage.setItem("token", token);
            navigate("/");
        } catch {
            setError("Could not connect to server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
                    <Stack spacing={2} component="form" onSubmit={handleLogin}>
                        <Typography variant="h4" component="h1">
                            Login
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Provide user information.
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
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button variant="contained" size="large" fullWidth type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log in"}
                        </Button>
                        <Divider>or</Divider>
                        <Button
                            variant="outlined" size="large" fullWidth
                            startIcon={
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                    alt="Google"
                                    style={{ width: 20, height: 20 }}
                                />
                            }>Google</Button>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
}
