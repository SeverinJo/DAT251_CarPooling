import { useState } from "react";
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import type { TripResponse } from "../../api/generated/models/TripResponse";
import { joinTrip } from "../../api/api";

type Props = {
    trip: TripResponse;
};

function DriverCard({ trip }: Props) {
    const initial = trip.driverUsername?.[0]?.toUpperCase() ?? "?";
    const departure = trip.departureTime ? new Date(trip.departureTime) : null;
    const [requested, setRequested] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleRequest() {
        if (!trip.id) return;
        setLoading(true);
        setError(null);
        try {
            await joinTrip(trip.id);
            setRequested(true);
        } catch {
            setError("Could not send request. You may have already requested this trip.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5}>

                    {/* Driver header */}
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontSize: 16 }}>
                            {initial}
                        </Avatar>
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                                {trip.driverUsername}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Driver
                            </Typography>
                        </Box>
                        <Chip
                            icon={<AirlineSeatReclineNormalIcon />}
                            label={`${trip.seatsAvailable} seats`}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>

                    <Divider />

                    {/* Route */}
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <LocationOnIcon fontSize="small" color="primary" sx={{ mt: 0.3 }} />
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {trip.origin?.addressName} {trip.origin?.number}, {trip.origin?.city}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">→</Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {trip.destination?.addressName} {trip.destination?.number}, {trip.destination?.city}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Departure time */}
                    {departure && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {departure.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                                {" · "}
                                {departure.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                            </Typography>
                        </Stack>
                    )}

                    {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}

                    <Button
                        variant={requested ? "outlined" : "contained"}
                        color={requested ? "success" : "primary"}
                        size="small"
                        fullWidth
                        disabled={requested || loading}
                        onClick={handleRequest}
                        sx={{ borderRadius: 2, textTransform: "none", mt: 0.5 }}
                    >
                        {requested ? "Request sent!" : loading ? "Sending..." : "Request a seat"}
                    </Button>

                </Stack>
            </CardContent>
        </Card>
    );
}

export default DriverCard;