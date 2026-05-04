import { useEffect, useState } from "react"
import { currentUser, getBookings } from "../api/mock"
import { Avatar, Box, Container, Paper, Stack, Typography } from "@mui/material"
import type { Booking } from "../types"

function ProfilePage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getBookings().then((data) => {
            setBookings(data)
            setLoading(false)
        })
    }, [])

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
                    <Stack spacing={2} alignItems="center">
                        <Avatar src={currentUser.avatar} sx={{ width: 120, height: 120 }} />
                        <Typography variant="h4" component="h1">
                            {currentUser.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {currentUser.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Rating: {currentUser.rating}
                        </Typography>
                        {currentUser.bio && (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                                {currentUser.bio}
                            </Typography>
                        )}
                        {loading ? (
                            <Typography variant="body2">Loading bookings...</Typography>
                        ) : (
                            bookings.map(b => (
                                <div key={b.id}>{/* booking card */}</div>
                            ))
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Container>
    )
}

export default ProfilePage;