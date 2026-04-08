import {Box, Button, Container, Divider, Paper, Stack, TextField, Typography} from "@mui/material";

export default function LoginPage() {
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
                        <Stack spacing={2}>
                            <Typography variant="h4" component="h1">
                                Login
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Provide user information.
                            </Typography>

                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                            />

                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                required
                            />

                            <Button variant="contained" size="large" fullWidth>
                                Logg in
                            </Button>
                            <Divider>
                                or
                            </Divider>
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